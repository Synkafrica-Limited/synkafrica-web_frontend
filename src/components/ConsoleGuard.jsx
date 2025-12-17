"use client";

import { useEffect } from 'react';

/**
 * ConsoleGuard component
 * Suppresses console output in production environments.
 * Should be mounted in the root layout.
 */
export default function ConsoleGuard() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            // Create a no-op function
            const noop = () => { };

            // Suppress specific console methods
            // We explicitly keep console.error for critical crash reports
            window.console.log = noop;
            window.console.info = noop;
            window.console.warn = noop;
            window.console.debug = noop;
        }
    }, []);

    return null;
}
