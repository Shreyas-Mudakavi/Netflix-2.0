import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Spinner from '../components/Spinner'
import useAuth from '../hooks/useAuth'

interface Inputs {
  email: string
  password: string
}
const Login = () => {
  const [login, setLogin] = useState(false)
  const { signUp, signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    // console.log(data)

    if (login) {
      setIsLoading(true)
      await signIn(email, password)

      // setIsLoading(false)
    } else {
      await signUp(email, password)
    }
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <div className="spinner">
  //         <span className="hidden ">Loading...</span>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Netflix</title>
        <link
          rel="icon"
          href="https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico"
        />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-40 sm:!inline"
        objectFit="cover"
      />

      {/* netflix logo */}
      <img
        src="https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg" // add the host name (www.logo.wine) in config file if using <Image>
        className="absolute left-2 top-2 cursor-pointer object-contain shadow-md md:left-6 md:top-0"
        width={200}
        height={200}
        alt="logo"
      />

      {!isLoading ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-28 space-y-8 rounded bg-black/75 px-6 py-10 md:mt-0 md:max-w-md md:px-14"
        >
          <h1 className="text-4xl font-semibold">Sign In</h1>
          <div className="space-y-4">
            <label className="inline-block w-full">
              <input
                type="email"
                placeholder="Email"
                className={`input ${
                  errors.email && 'border-b-2 border-orange-500'
                }`}
                {...register('email', { required: true })}
              />
              {errors.email && (
                <p className="p-1 text-[14px] font-light text-orange-500">
                  Please enter a valid email.
                </p>
              )}
            </label>
            <label className="inline-block w-full">
              <input
                type="password"
                placeholder="Password"
                className={`input ${
                  errors.email && 'border-b-2 border-orange-500'
                }`}
                {...register('password', { required: true })}
              />
              {errors.password && (
                <p className="p-1 text-[14px] font-light text-orange-500">
                  Your password must contain between 4 and 60 characters.
                </p>
              )}
            </label>
          </div>

          <button
            onClick={() => {
              setLogin(true)
            }}
            type="submit"
            className="w-full rounded bg-[#e50914] py-3 font-semibold"
          >
            Sign In
          </button>

          <div className="text-[gray]">
            New to Netflix?{' '}
            <Link href="/signup">
              <span className="cursor-pointer text-white hover:underline">
                Sign Up Now
              </span>
            </Link>
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default Login
