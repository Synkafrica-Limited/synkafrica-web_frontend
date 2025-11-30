# Backend Ownership Guard — Patch Notes and Snippets

This document provides a ready-to-apply patch and example code for enforcing business ownership checks on vendor transaction endpoints. Use the snippets below in your backend repository (Node/Express + Prisma example) to add a `businessId` query parameter to vendor endpoints and verify ownership before applying filters.

---

## Overview

- Add optional `businessId` query parameter to vendor transaction endpoints.
- When provided, verify the business exists and is owned by the requesting vendor (or the requester is staff for that business).
- If the check passes, include `businessId` in the database `where` clause.
- If the check fails, return 403 Forbidden.

This prevents vendors from requesting transactions for businesses they don't own.

## Example helper: businessOwnership.ts

Place this in a shared service/util location (e.g., `services/businessOwnership.ts`).

```ts
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

const prisma = new PrismaClient();

export async function assertVendorOwnsBusiness({ businessId, vendorId, requireStaff = false }) {
  if (!businessId) return null;

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new createHttpError.NotFound('Business not found');

  // ownerId is the canonical owner of the business
  if (business.ownerId === vendorId) return business;

  if (requireStaff) {
    // If your data model supports staff relationships, verify membership
    const membership = await prisma.businessStaff.findFirst({
      where: { businessId, userId: vendorId, active: true }
    });
    if (membership) return business;
  }

  throw new createHttpError.Forbidden('You do not have access to this business');
}
```

## Controller example (Express / Nest-like)

In the vendor transactions controller, accept `businessId` as an optional query param and forward to the service.

```ts
// GET /api/transactions/vendor
async function getVendorTransactions(req, res, next) {
  try {
    const vendorId = req.user.id; // from auth middleware
    const { businessId, status, payoutStatus, startDate, endDate, skip, take } = req.query;

    // Pass businessId to service — service will validate ownership if provided
    const params = { businessId, status, payoutStatus, startDate, endDate, skip: Number(skip)||0, take: Number(take)||20 };
    const txns = await transactionService.findVendorTransactions(vendorId, params);
    res.json(txns);
  } catch (err) {
    next(err);
  }
}
```

## Service change (Prisma) — verify ownership then filter

```ts
import prisma from '../prisma';
import { assertVendorOwnsBusiness } from './businessOwnership';

export async function findVendorTransactions(vendorId, params = {}) {
  const { businessId, status, payoutStatus, startDate, endDate, skip = 0, take = 20 } = params;

  // If businessId was provided, ensure the vendor actually owns or is staff for the business
  if (businessId) {
    await assertVendorOwnsBusiness({ businessId, vendorId, requireStaff: true });
  }

  const where = {
    vendorId,
    ...(businessId ? { businessId } : {}),
    ...(status ? { status } : {}),
    ...(payoutStatus ? { payoutStatus } : {}),
    ...(startDate ? { createdAt: { gte: new Date(startDate) } } : {}),
    ...(endDate ? { createdAt: { lte: new Date(endDate) } } : {}),
  };

  const txns = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  return txns;
}
```

## Notes & Tests

- Add unit tests asserting that providing another user's `businessId` results in 403/Forbidden.
- When `businessId` is omitted, behavior remains vendor-scoped by `vendorId` only (existing behavior).
- Consider adding an admin override (admins can pass any businessId).

## Migration / Data model

- Ensure `business.ownerId` exists and `businessStaff` or equivalent table exists if you want staff membership checks.

---

If you want I can also produce a concrete patch for your backend repository (PR-ready), but I'll need the backend repo layout or ability to push a branch there.
