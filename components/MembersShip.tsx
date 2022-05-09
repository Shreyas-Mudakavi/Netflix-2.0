import useAuth from '../hooks/useAuth'
import Loader from './Loader'
import useSubcription from './../hooks/useSubcription'
import { useState } from 'react'
import { goToBillingPortal } from '../lib/stripe'

const MembersShip = () => {
  const { user } = useAuth()
  const subscription = useSubcription(user)
  const [isBillingLoading, setIsBillingLoading] = useState(false)

  const manageSubscription = () => {
    if (subscription) {
      setIsBillingLoading(true)

      goToBillingPortal() // we need to create this in stripe
    }
  }

  return (
    <div
      className="mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 
    md:border-t md:border-b-0 md:px-0"
    >
      <div className="space-y-2 py-4">
        <h4 className=" text-lg text-[gray]">Membership & Billing</h4>
        <button
          disabled={isBillingLoading || !subscription}
          className=" bg-gray-230 h-10 w-3/5 whitespace-nowrap
         bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5"
          onClick={manageSubscription}
        >
          {isBillingLoading ? (
            <Loader color="dark:fill-[#e50914]" />
          ) : (
            'Cancel Subscription'
          )}
        </button>
      </div>
    </div>
  )
}

export default MembersShip
