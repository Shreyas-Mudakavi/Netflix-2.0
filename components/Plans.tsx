import { CheckIcon } from '@heroicons/react/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import Loader from './Loader'
import Table from './Table'
import { useRouter } from 'next/router'
import { loadCheckout } from '../lib/stripe'

interface Props {
  products: Product[]
}

const Plans = ({ products }: Props) => {
  const { logOut, user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[3])
  const [isBillingLoading, setIsBillingLoading] = useState(false)

  const router = useRouter()

  const subscribeToPlan = () => {
    if (!user) {
      router.push('/login')
    }

    loadCheckout(selectedPlan?.prices[0].id!)
    setIsBillingLoading(true)
  }

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link
          rel="icon"
          href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"
        />
      </Head>

      <header className="!absolute !h-20  border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg" // add the host name (www.logo.wine) in config file if using <Image>
            className="cursor-pointer object-contain  md:w-48"
            width={130}
            height={130}
            alt="logo"
          />
        </Link>

        <button
          onClick={logOut}
          className="text-sm font-medium hover:underline md:text-lg"
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>

        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-5 w-5 text-[#e50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-5 w-5 text-[#e50914]" />
            Recommendations just for you.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-5 w-5 text-[#e50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {/* plans */}
            {products.map((product) => {
              return (
                <div
                  key={product.id}
                  className={`planBox  ${
                    selectedPlan?.id === product.id
                      ? 'opacity-100'
                      : 'opacity-60'
                  }`}
                  onClick={() => setSelectedPlan(product)}
                >
                  {product.name}
                </div>
              )
            })}
          </div>

          <Table products={products} selectedPlan={selectedPlan} />

          <div className=" flex w-full flex-col space-y-4 text-sm text-gray-400 md:w-[815px]">
            <p>
              HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability
              subject to your internet service and device capabilities. Not all
              content is available in all resolutions. See our{' '}
              <a
                className="text-blue-600 hover:underline"
                target={'_blank'}
                href="https://help.netflix.com/legal/termsofuse"
              >
                Terms of Use
              </a>{' '}
              for more details.
            </p>

            <p>
              Only people who live with you may use your account. Watch on 4
              different devices at the same time with Premium, 2 with Standard,
              and 1 with Basic and Mobile.
            </p>
          </div>

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-10/12 rounded bg-[#e50914] py-4 text-2xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? <Loader color="dark:fill-gray-300" /> : 'Next'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Plans
