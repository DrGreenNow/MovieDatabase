/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'
import useSubscriptios from '../hooks/useSubscriptios'
import useAuth from '../hooks/useAuth'
import Membership from '../components/Membership'
import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import { GetStaticProps } from 'next'
import payments, { goToBillingPortal } from '../lib/stripe'

interface Props {
  products: Product[]
}

const Account = ({ products }: Props) => {
  const { user, logout } = useAuth()
  const subscription = useSubscriptios(user)

  return (
    <div>
      <Head>
        <title>Account Settings - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="object-contain cursor-pointer"
            alt=""
          />
        </Link>
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="rounded cursor-pointer"
          />
        </Link>
      </header>

      <main className="max-w-6xl px-5 pt-24 pb-12 mx-auto transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since {subscription?.created}
            </p>
          </div>
        </div>
        <Membership />
        <div className="grid grid-cols-1 gap-4 px-4 py-4 mt-6 border md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4>Plan Details</h4>
          <div className="col-span-2 font-medium">
            {
              products.filter(
                (product) => product.id === subscription?.product,
              )[0]?.name
            }
          </div>
          <p
            className="text-blue-500 cursor-pointer hover:underline md:text-right"
            onClick={goToBillingPortal}
          >
            Change plan
          </p>
        </div>
        <div className="grid grid-cols-1 px-4 py-4 mt-6 border gap-x-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 text-blue-500 cursor-pointer hover:underline"
            onClick={logout}
          >
            Sign out of all devices
          </p>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message))

  return {
    props: {
      products,
    },
  }
}

export default Account
