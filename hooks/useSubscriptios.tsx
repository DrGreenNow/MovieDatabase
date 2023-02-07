import { useEffect, useState } from 'react'
import {
  Subscription,
  onCurrentUserSubscriptionUpdate,
} from '@stripe/firestore-stripe-payments'
import { User } from 'firebase/auth'
import payments from '../lib/stripe'

export default function useSubscriptios(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    if (!user) return

    onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
      setSubscription(
        snapshot.subscriptions.filter(
          (subscription) =>
            subscription.status === 'active' ||
            subscription.status === 'trialing',
        )[0],
      )
    })
  }, [user])

  return subscription
}
