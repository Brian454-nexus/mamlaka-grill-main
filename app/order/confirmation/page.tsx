"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Home, Phone } from "lucide-react"

/**
 * Order Confirmation Page Component
 *
 * This component displays the confirmation details after a customer places an order.
 * It retrieves the order details from localStorage based on the order ID in the URL.
 *
 * Features:
 * - Displays order ID, table number, and phone number
 * - Shows order summary with items and prices
 * - Provides payment instructions for M-PESA
 * - Includes navigation back to home or to place another order
 */
export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const [order, setOrder] = useState<any>(null)

  // Fetch order details from localStorage when component mounts
  useEffect(() => {
    if (orderId) {
      // In a real app, this would fetch from your API
      // For demo purposes, we're using localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = orders.find((o: any) => o.id === orderId)
      setOrder(foundOrder)
    }
  }, [orderId])

  // Show loading state while fetching order
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-green-800 animate-pulse" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-green-200 shadow-lg">
          {/* Confirmation header */}
          <CardHeader className="text-center bg-green-800 text-white rounded-t-lg">
            <div className="mx-auto mb-4 bg-white w-20 h-20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription className="text-green-100">
              Your order has been received and is being prepared
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Order details */}
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <span className="text-green-800 font-medium">{orderId?.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Table Number:</span>
                  <span className="text-green-800 font-medium">{order.tableNumber}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Phone Number:</span>
                  <span className="text-green-800 font-medium flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {order.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-amber-500" />
                    <span className="text-amber-600 font-medium">Being prepared</span>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <h3 className="font-medium text-green-800 mb-3">Order Summary</h3>
                <div className="border rounded-md divide-y bg-white">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between p-3">
                      <div>
                        <span className="text-gray-800">
                          {item.quantity} × {item.name}
                        </span>
                        {item.selectedOption && (
                          <span className="block text-xs text-gray-600">{item.selectedOption}</span>
                        )}
                      </div>
                      <span className="font-medium">KSh {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 font-medium bg-gray-50">
                    <span className="text-gray-800">Total</span>
                    <span className="text-green-800">KSh {order.total}</span>
                  </div>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="bg-green-50 p-4 rounded-md border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">Payment Instructions</h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-center">Pay via M-PESA</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-gray-600">Paybill:</div>
                      <div className="font-medium">123456</div>
                      <div className="text-gray-600">Account:</div>
                      <div className="font-medium">Table {order.tableNumber}</div>
                      <div className="text-gray-600">Amount:</div>
                      <div className="font-medium">KSh {order.total}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please make your payment when your meal is served. Your phone number will be used to identify your
                    payment.
                  </p>
                </div>
              </div>

              {/* Order status message */}
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100 text-amber-800">
                <p className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  Your order will be served to your table shortly. Thank you for your patience!
                </p>
              </div>
            </div>
          </CardContent>

          {/* Navigation buttons */}
          <CardFooter className="bg-gray-50 rounded-b-lg border-t p-4">
            <div className="w-full space-y-3">
              <Link href="/" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
              <div className="text-center">
                <Link href="/order" className="text-sm text-green-800 hover:underline">
                  Place another order
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

