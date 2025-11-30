import { appendNested } from '@/utils/appendNested';

export function createListingMultipart(payload, files = []) {
  const form = new FormData();

  // primitive fields
  Object.entries(payload).forEach(([key, value]) => {
    if (value == null) return;

    if (typeof value !== 'object') {
      form.append(key, value);
    }
  });

  // nested objects
  if (payload.location)
    appendNested(form, 'location', payload.location);

  if (payload.resort)
    appendNested(form, 'resort', payload.resort);

  if (payload.carRental)
    appendNested(form, 'carRental', payload.carRental);

  if (payload.convenience)
    appendNested(form, 'convenience', payload.convenience);

  if (payload.dining)
    appendNested(form, 'dining', payload.dining);

  // attach files
  files.forEach((file, idx) => {
    const f = file.file || file;
    if (f instanceof File) {
      form.append('images', f, f.name || `image-${idx}`);
    }
  });

  return api.post('/api/listings', form, { auth: true });
}
