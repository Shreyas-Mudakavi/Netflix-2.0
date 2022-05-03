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
      await signIn(email, password)
    } else {
      setIsLoading(true)
      await signUp(email, password)

      setIsLoading(false)
    }
  }

  // if (isLoading) {
  //   return (
  //     <div className=" flex items-center justify-center md:text-5xl">
  //       {' '}
  //       Loading...
  //     </div>
  //   )
  // }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />

      {/* netflix logo */}
      <img
        src="https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg" // add the host name (www.logo.wine) in config file if using <Image>
        className="object-containl absolute left-2 top-2 cursor-pointer md:left-6 md:top-6"
        width={150}
        height={150}
        alt="logo"
      />

      {!isLoading ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-28 space-y-8 rounded bg-black/75 px-6 py-10 md:mt-0 md:max-w-md md:px-14"
        >
          <h1 className="text-4xl font-semibold">Sign Up</h1>
          <div className="space-y-4">
            <label className="inline-block w-full">
              <input
                type="email"
                placeholder="Email"
                className="input"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <p className="p-1 text-[13px] font-light text-orange-500">
                  Please enter a valid email!
                </p>
              )}
            </label>
            <label className="inline-block w-full">
              <input
                type="password"
                placeholder="Password"
                className="input"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <p className="p-1 text-[13px] font-light text-orange-500">
                  Password should be 4 to 16 characters long.
                </p>
              )}
            </label>
          </div>

          <button
            onClick={() => {
              setLogin(false)
            }}
            type="submit"
            className="w-full rounded bg-[#e50914] py-3 font-semibold"
          >
            Sign Up
          </button>

          <div className="text-[gray]">
            Already a user?{' '}
            <Link href="/login">
              <span className="cursor-pointer text-white hover:underline">
                Sign In Now
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
