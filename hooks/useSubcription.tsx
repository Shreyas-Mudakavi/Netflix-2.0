import {
  onCurrentUserSubscriptionUpdate,
  Subscription,
} from '@stripe/firestore-stripe-payments'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import payments from '../lib/stripe'

const useSubcription = (user: User | null) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }

    onCurrentUserSubscriptionUpdate(payments, (sanpShot) => {
      setSubscription(
        sanpShot.subscriptions.filter(
          (sub) => sub.status === 'active' || sub.status === 'trialing'
        )[0]
      )
    })
  }, [user])

  return subscription
}

export default useSubcription
