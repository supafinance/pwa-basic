'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const VAPID_PUBLIC_KEY = 'BIvRbb0VvJZyy2JK95wn0p9BL5yBEk78_L-lJVYyhzfDZpRKmbdgmLkQ2lJfTX7k90GBI7OVageUIJpUL8wXbBU'

export const PWA = () => {
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

    console.log('swRegistration', swRegistration)
    useEffect(() => {
        console.log('PWA component mounted')
        if ('serviceWorker' in navigator) {
            initServiceWorker()
        } else {
            console.log('Service workers are not supported')
        }
    }, [])

    const initServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
            setSwRegistration(registration)
            toast.success('Service worker registered')
            console.log('Service worker registered:', registration)

            const pushManager = registration.pushManager
            if (isPushManagerActive(pushManager)) {
                const permissionState = await pushManager.permissionState({ userVisibleOnly: true })
                toast.info(`Permission state: ${permissionState}`)
                toast.info(`${JSON.stringify(permissionState)}`)
                handlePermissionState(permissionState, pushManager)
            }
        } catch (error) {
            toast.error('Error registering service worker')
            console.error('Service worker registration failed:', error)
        }
    }

    const isPushManagerActive = (pushManager: PushManager): boolean => {
        if (!pushManager) {
            // @ts-ignore
            if (!window.navigator.standalone) {
                toast.info('Please add this app to your home screen for full functionality')
            } else {
                console.error('PushManager is not active')
            }
            return false
        }
        return true
    }

    const handlePermissionState = async (state: PermissionState, pushManager: PushManager) => {
        console.log('Permission state:', state)
        toast.info(`Permission state: ${state}`)

        switch (state) {
            case 'prompt':
                toast.info('You can subscribe to push notifications')
                const permission = await Notification.requestPermission()
                break
            case 'granted':
                const subscription = await pushManager.getSubscription()
                if (subscription) {
                    setPushSubscription(subscription)
                    toast.success('Push subscription active')
                }
                break
            case 'denied':
                toast.error('Push notifications are denied')
                break
        }
    }

    const subscribeToPush = async () => {
        let swRegistration = await navigator.serviceWorker.getRegistration()
        if (!swRegistration) {
            toast.error('Service worker not registered')
            throw new Error('Service worker not registered')
        }
        let pushManager = swRegistration.pushManager;
        if (!isPushManagerActive(pushManager)) {
            return;
        }
        let subscriptionOptions = {
            userVisibleOnly: true,
            applicationServerKey: base64ToUint8Array(VAPID_PUBLIC_KEY)
        };
        try {
            let subscription = await pushManager.subscribe(subscriptionOptions)
            setPushSubscription(subscription)
            toast.success('Successfully subscribed to push notifications')
            // Here you can send fetch request with subscription data to your backend API for next push sends from there
        } catch (error) {
            toast.error('Failed to subscribe to push notifications')
            console.error('Push subscription failed:', error)
        }
    }

    const testSend = () => {
        if (!swRegistration) return

        const title = "Push title"
        const options = {
            body: "Additional text with some description",
            icon: "/images/push_icon.jpg",
            image: "https://example.com/large-image.jpg",
            data: {
                url: "/?page=success",
                message_id: "your_internal_unique_message_id_for_tracking"
            },
        }

        swRegistration.showNotification(title, options)
    }

    return (
        <div className="flex flex-col gap-y-6">
            {!pushSubscription && (
                <Button onClick={subscribeToPush}>Subscribe to Push Notifications</Button>
            )}
            {pushSubscription && (
                <div>
                    <p>Push subscription active</p>
                    <Button onClick={testSend}>Test Push Notification</Button>
                    <div>Active Subscription: {JSON.stringify(pushSubscription)}</div>
                </div>
            )}
            <div>
                push subscription:
                {JSON.stringify(pushSubscription)}
            </div>
            <div>
                service worker registration:
                {stringifyServiceWorkerRegistration(swRegistration)}
            </div>
        </div>
    )
}

const stringifyServiceWorkerRegistration = (registration: ServiceWorkerRegistration | null): string => {
    if (!registration) return 'null';
    return JSON.stringify({
        scope: registration.scope,
        active: registration.active ? {
            scriptURL: registration.active.scriptURL,
            state: registration.active.state
        } : null,
        installing: registration.installing ? {
            scriptURL: registration.installing.scriptURL,
            state: registration.installing.state
        } : null,
        waiting: registration.waiting ? {
            scriptURL: registration.waiting.scriptURL,
            state: registration.waiting.state
        } : null,
        updateViaCache: registration.updateViaCache
    }, null, 2);
};

const base64ToUint8Array = (base64: any) => {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(b64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}