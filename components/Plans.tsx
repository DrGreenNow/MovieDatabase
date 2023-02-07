/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Product } from '@stripe/firestore-stripe-payments'
import Table from './Table'
import { useState } from 'react'
import Loader from './Loader'
import { loadCheckout } from '../lib/stripe'

interface Props {
  products: Product[]
}

function Plans({ products }: Props) {
  const { logout, user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2])
  const [isBillingLoading, setBillingLoading] = useState(false)

  const subscribeToPlan = () => {
    if (!user) return

    loadCheckout(selectedPlan?.prices[0].id!)
    setBillingLoading(true)
  }

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="object-contain cursor-pointer"
          />
        </Link>
        <button
          onClick={logout}
          className="text-lg font-medium hover:underline"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-5xl px-5 pb-12 mx-auto transition-all pt-28 md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan thats right for you
        </h1>
        <ul>
          <li className="flex items-center text-lg gap-x-2">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center text-lg gap-x-2">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
            just for you.
          </li>
          <li className="flex items-center text-lg gap-x-2">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>
        <div className="flex flex-col mt-4 space-y-4">
          <div className="flex items-center self-end justify-center w-full md:w-3/5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`planBox ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSelectedPlan(product)}
              >
                {product.name}
              </div>
            ))}
          </div>
          <Table products={products} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Plans
