import {
  createCheckoutSession,
  getStripePayments,
} from '@stripe/firestore-stripe-payments'
import { getFunctions, httpsCallable } from '@firebase/functions'
import app from '../firebase'

const payments = getStripePayments(app, {
  productsCollection: 'products', // 'products' is the name of the collection
  customersCollection: 'customers',
})

const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  })
    .then((snapShot) => {
      window.location.assign(snapShot.url)
    })
    .catch((err) => console.log(err.message))
}

const goToBillingPortal = async () => {
  const instance = getFunctions(app, 'us-central1')

  const functionRef = httpsCallable(
    instance,
    'ext-firestore-stripe-payments-createPortalLink'
  ) // it will give us a link to the billing portal

  await functionRef({
    returnUrl: `${window.location.origin}/account`,
  })
    .then(({ data }: any) => {
      window.location.assign(data.url)
    })
    .catch((err) => console.log(err.message))
}

export { loadCheckout, goToBillingPortal }

export default payments
