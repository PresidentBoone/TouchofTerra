"use client";

import { useEffect } from "react";

/**
 * The previous Touch of Terra app registered a service worker. Left in place it
 * serves stale cached assets on the same origin, so we proactively unregister
 * any service workers and clear their caches on load. Safe no-op otherwise.
 */
export const ServiceWorkerCleanup = () => {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      })
      .catch(() => {});

    if ("caches" in window) {
      caches
        .keys()
        .then((keys) => keys.forEach((key) => void caches.delete(key)))
        .catch(() => {});
    }
  }, []);

  return null;
};
