"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Clock, LogOut, Phone, ShoppingBag, Smartphone, Utensils } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

/**
 * Staff Portal Page Component
 *
 * This component provides the interface for restaurant staff to manage orders.
 * Features include:
 * - Staff authentication with PIN
 * - Viewing pending, served, and paid orders
 * - Marking orders as served
 * - Confirming payments via M-PESA
 * - Tracking order status
 */
export default function StaffPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [staffPin, setStaffPin] = useState("")
  const [error, setError] = useState("")

  // Orders state
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [paymentReference, setPaymentReference] = useState("")

  // Fetch orders from localStorage when component mounts
  useEffect(() => {
    // In a real app, this would fetch from your API
    // For demo purposes, we're using localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)

    // Set up polling to refresh orders every 10 seconds
    const interval = setInterval(() => {
      const refreshedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(refreshedOrders)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Handle staff login
   * Validates the PIN and sets authentication state
   */
  const handleLogin = () => {
    // In a real app, this would validate against your backend
    // For demo purposes, we're using a simple PIN: 1234
    if (staffPin === "1234") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid PIN. Please try again.")
    }
  }

  /**
   * Handle staff logout
   * Resets authentication state and PIN
   */
  const handleLogout = () => {
    setIsAuthenticated(false)
    setStaffPin("")
  }

  /**
   * Update the status of an order
   *
   * @param orderId - The ID of the order to update
   * @param status - The new status to set
   */
  const updateOrderStatus = (orderId: string, status: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  /**
   * Mark an order as served
   *
   * @param orderId - The ID of the order to mark as served
   */
  const markAsServed = (orderId: string) => {
    updateOrderStatus(orderId, "served")
  }

  /**
   * Mark an order as paid
   * Records payment details including method, reference, and time
   *
   * @param orderId - The ID of the order to mark as paid
   */
  const markAsPaid = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      const updatedOrder = {
        ...order,
        status: "paid",
        paymentMethod: "mpesa",
        paymentReference: paymentReference || "N/A",
        paymentTime: new Date().toISOString(),
      }

      const updatedOrders = orders.map((o) => (o.id === orderId ? updatedOrder : o))

      setOrders(updatedOrders)
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
      setSelectedOrder(null)
      setPaymentReference("")
    }
  }

  // Filter orders by status
  const pendingOrders = orders.filter((order) => order.status === "pending")
  const servedOrders = orders.filter((order) => order.status === "served")
  const paidOrders = orders.filter((order) => order.status === "paid")

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md border-black">
          <CardHeader className="bg-black text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Utensils className="mr-2 h-5 w-5" />
              Mamlaka Grill Staff Portal
            </CardTitle>
            <CardDescription className="text-gray-300">Enter your staff PIN to access the portal</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="pin">Staff PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">For demo purposes, use PIN: 1234</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg border-t p-4">
            <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Main staff portal interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <header className="bg-black text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-bold">Mamlaka Grill Staff Portal</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-black"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Order tabs: Pending, Served, Completed */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border rounded-lg p-1">
            <TabsTrigger value="pending" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              Pending Orders
              {pendingOrders.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="served" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              Served Orders
              {servedOrders.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                  {servedOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              Completed Orders
              {paidOrders.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {paidOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pending Orders Tab */}
          <TabsContent value="pending">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingOrders.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg border">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No pending orders</h3>
                  <p className="text-gray-500">New orders will appear here</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="border-green-100 overflow-hidden">
                    <CardHeader className="pb-2 bg-green-50">
                      <div className="flex justify-between">
                        <CardTitle className="text-green-800">Table #{order.tableNumber}</CardTitle>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <CardDescription>
                        Order #{order.id.substring(0, 8)} • {new Date(order.orderTime).toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3 text-sm">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-700">{order.phoneNumber}</span>
                      </div>
                      <ScrollArea className="h-[150px] pr-4">
                        <div className="space-y-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-800">
                                {item.quantity} × {item.name}
                              </span>
                              <span className="font-medium">KSh {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-4 pt-2 border-t flex justify-between font-medium">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-green-800">KSh {order.total}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t p-4">
                      <Button
                        className="w-full bg-green-800 hover:bg-green-900 text-white"
                        onClick={() => markAsServed(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Served
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Served Orders Tab */}
          <TabsContent value="served">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servedOrders.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg border">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No served orders</h3>
                  <p className="text-gray-500">Orders marked as served will appear here</p>
                </div>
              ) : (
                servedOrders.map((order) => (
                  <Card key={order.id} className="border-amber-100 overflow-hidden">
                    <CardHeader className="pb-2 bg-amber-50">
                      <div className="flex justify-between">
                        <CardTitle className="text-amber-800">Table #{order.tableNumber}</CardTitle>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Served
                        </Badge>
                      </div>
                      <CardDescription>
                        Order #{order.id.substring(0, 8)} • {new Date(order.orderTime).toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3 text-sm">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-700">{order.phoneNumber}</span>
                      </div>
                      <ScrollArea className="h-[150px] pr-4">
                        <div className="space-y-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
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
                        </div>
                      </ScrollArea>
                      <div className="mt-4 pt-2 border-t flex justify-between font-medium">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-amber-800">KSh {order.total}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t p-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-green-800 hover:bg-green-900 text-white"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Confirm M-PESA Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm M-PESA Payment</DialogTitle>
                            <DialogDescription>
                              Table #{order.tableNumber} • Phone: {order.phoneNumber} • Total: KSh {order.total}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="reference">M-PESA Transaction Code</Label>
                              <Input
                                id="reference"
                                placeholder="e.g., QWE123456"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                              />
                              <p className="text-xs text-gray-500">
                                Enter the M-PESA transaction code provided by the customer
                              </p>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              onClick={() => markAsPaid(order.id)}
                              disabled={!paymentReference}
                              className="bg-green-800 hover:bg-green-900 text-white"
                            >
                              Confirm Payment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Paid/Completed Orders Tab */}
          <TabsContent value="paid">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paidOrders.length === 0 ? (
                <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg border">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No completed orders</h3>
                  <p className="text-gray-500">Paid orders will appear here</p>
                </div>
              ) : (
                paidOrders.map((order) => (
                  <Card key={order.id} className="border-green-100 overflow-hidden">
                    <CardHeader className="pb-2 bg-green-50">
                      <div className="flex justify-between">
                        <CardTitle className="text-green-800">Table #{order.tableNumber}</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      </div>
                      <CardDescription>
                        Order #{order.id.substring(0, 8)} • {new Date(order.orderTime).toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3 text-sm">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-gray-700">{order.phoneNumber}</span>
                      </div>
                      <ScrollArea className="h-[150px] pr-4">
                        <div className="space-y-1">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-800">
                                {item.quantity} × {item.name}
                              </span>
                              <span className="font-medium">KSh {item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-4 pt-2 border-t space-y-2">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-800">Total:</span>
                          <span className="text-green-800">KSh {order.total}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Payment Method:</span>
                          <span className="flex items-center">
                            <Smartphone className="h-3 w-3 mr-1 text-green-600" />
                            M-PESA
                          </span>
                        </div>
                        {order.paymentReference !== "N/A" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Transaction Code:</span>
                            <span className="font-medium">{order.paymentReference}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

