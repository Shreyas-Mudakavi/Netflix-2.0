import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import useSubcription from './../hooks/useSubcription'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import payments from './../lib/stripe'
import dateFormat from 'dateformat'
import MembersShip from '../components/MembersShip'

interface Props {
  products: Product[]
}

const account = ({ products }: Props) => {
  const { user, logOut } = useAuth()
  const subscription = useSubcription(user)
  console.log(products)
  console.log(subscription, 'subscription')

  const date = subscription?.created
  // const memberSince = format(new Date(date), 'mediumDate')

  return (
    <div>
      <Head>
        <title>Account Settings - Netflix</title>
        <link
          rel="icon"
          href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"
        />
      </Head>

      <header className="bg-[#141414]">
        <Link href="/">
          <img
            src="https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg"
            width={150}
            height={150}
            className="cursor-pointer object-contain"
            alt="logo"
          />
        </Link>
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-2 ">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-5 w-5" />
            <p className="text-xs font-semibold text-[#555]">
              Member since{' '}
              {dateFormat(subscription?.created, 'dddd, mmmm dS, yyyy')}
              {/* Member since */}
            </p>
          </div>
        </div>

        <MembersShip />

        <div
          className=" mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 
        md:border-t md:border-b-0 md:px-0 md:pb-0"
        >
          <h4>Plan Details</h4>
          {/* find the current plan of user */}
          <div className="">
            {
              products.filter(
                (product) => product.id === subscription?.product
              )[0]?.name
            }
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change Plan
          </p>
        </div>

        <div
          className=" mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 
        md:border-t md:border-b-0 md:px-0 md:pb-0"
        >
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logOut}
          >
            Sign out of all devices{' '}
          </p>
        </div>
      </main>
    </div>
  )
}

export default account

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((err) => console.log(err.message))

  return {
    props: {
      products,
    },
  }
}
