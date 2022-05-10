import useAuth from '../hooks/useAuth'
import Loader from './Loader'
import useSubcription from './../hooks/useSubcription'
import { useState } from 'react'
import { goToBillingPortal } from '../lib/stripe'
import dateFormat from 'dateformat'

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

      <div className=" col-span-3">
        <div className="flex flex-col justify-between border-b border-white/10 py-4 md:flex-row">
          <div>
            <p className=" font-medium">{user?.email}</p>
            <p className=" text-[gray]">Password: **********</p>
          </div>
          <div className="md:text-right">
            <p className="memberShipLink">Change email</p>
            <p className="memberShipLink">Change password</p>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0">
          <div>
            <p>
              {subscription?.cancel_at_period_end
                ? 'Your membership will end on '
                : 'Your next billing date is '}
              {dateFormat(
                subscription?.current_period_end,
                'dddd, mmmm dS, yyyy'
              )}
            </p>
          </div>
          <div className=" md:text-right">
            <p className="memberShipLink">Manage payment info</p>
            <p className="memberShipLink">Add backup payment method</p>
            <p className="memberShipLink">Billing details</p>
            <p className="memberShipLink">Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersShip
