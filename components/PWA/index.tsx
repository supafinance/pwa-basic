'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// You may want to move this to an environment variable
const VAPID_PUBLIC_KEY = 'BIvRbb0VvJZyy2JK95wn0p9BL5yBEk78_L-lJVYyhzfDZpRKmbdgmLkQ2lJfTX7k90GBI7OVageUIJpUL8wXbBU'

export const PWA = () => {
    const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
    const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

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
        switch (state) {
            case 'prompt':
                toast.info('You can subscribe to push notifications')
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
        if (!swRegistration) return

        const subscriptionOptions = {
            userVisibleOnly: true,
            applicationServerKey: VAPID_PUBLIC_KEY
        }

        console.log('Subscription options:', subscriptionOptions)

        try {
            const subscription = await swRegistration.pushManager.subscribe(subscriptionOptions)
            setPushSubscription(subscription)
            toast.success('Successfully subscribed to push notifications')
            // Here you can send fetch request with subscription data to your backend API
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
        <>
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
        </>
    )
}