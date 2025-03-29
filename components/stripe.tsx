"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

// Mock Stripe public key - in a real app, this would be your actual Stripe public key
const stripePromise = loadStripe("pk_test_mock_key")

interface StripeProps {
  options: {
    mode: "payment" | "subscription"
    amount: number
    currency: string
  }
  children: React.ReactNode
  className?: string
}

export function Stripe({ options, children, className }: StripeProps) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // In a real app, this would be an API call to your backend
    // For demo purposes, we're simulating the response
    const mockClientSecret = "pi_mock_secret_" + Math.random().toString(36).substring(2, 15)
    setClientSecret(mockClientSecret)
  }, [options])

  return (
    <div className={className}>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          {children}
        </Elements>
      )}
    </div>
  )
}

