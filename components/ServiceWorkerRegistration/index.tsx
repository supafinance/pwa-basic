'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log("Registered!");
                    toast.info('Service worker registered')
                    return navigator.serviceWorker.ready;
                })
                .then((registration) => {
                    console.log('ServiceWorker is ready and active');
                    toast.info('Service worker is ready and active')
                })
                .catch(error => {
                    toast.info('Error registering service worker')
                    console.error('ServiceWorker registration failed:', error);
                });
        }
    }, []);

    return null;
}