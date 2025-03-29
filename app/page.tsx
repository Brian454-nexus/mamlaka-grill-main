import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Utensils, Users, BarChart3 } from 'lucide-react'

/**
 * Home Page Component
 * 
 * This is the main landing page of the Mamlaka Grill Restaurant Ordering System.
 * It provides navigation to the customer ordering system, staff portal, and admin dashboard.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header section with restaurant name and tagline */}
      <header className="bg-green-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <Utensils className="mr-2 h-8 w-8" />
            Mamlaka Grill
          </h1>
          <p className="mt-2 text-green-100">Delicious food, seamless ordering</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Customer Ordering Card - Main Focus */}
          <Card className="md:col-span-8 lg:col-span-7 border-green-800 shadow-lg">
            <CardHeader className="bg-green-800 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Order Your Meal</CardTitle>
              <CardDescription className="text-green-100">Quick and easy ordering from your table</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* How It Works section */}
                <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">How It Works:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Enter your table number and phone number</li>
                    <li>Select your favorite dishes from our menu</li>
                    <li>Review your order and submit</li>
                    <li>Pay via M-PESA when your meal is served</li>
                  </ol>
                </div>

                {/* Process steps in grid layout */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center text-green-800 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">1</div>
                      <h3 className="font-medium">Browse Menu</h3>
                    </div>
                    <p className="text-sm text-gray-600">Explore our delicious selection of grilled specialties</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center text-green-800 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">2</div>
                      <h3 className="font-medium">Place Order</h3>
                    </div>
                    <p className="text-sm text-gray-600">Select your items and send directly to our kitchen</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center text-green-800 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">3</div>
                      <h3 className="font-medium">Enjoy Your Meal</h3>
                    </div>
                    <p className="text-sm text-gray-600">Our staff will serve your freshly prepared food</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center text-green-800 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">4</div>
                      <h3 className="font-medium">Pay via M-PESA</h3>
                    </div>
                    <p className="text-sm text-gray-600">Quick and secure payment using our paybill</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 rounded-b-lg">
              <Link href="/order" className="w-full">
                <Button className="w-full bg-green-800 hover:bg-green-900 text-white">
                  Start Ordering Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Staff and Admin Portals - Secondary */}
          <div className="md:col-span-4 lg:col-span-5 space-y-6">
            {/* Staff Portal Card */}
            <Card className="border-gray-200">
              <CardHeader className="bg-black text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Staff Portal
                </CardTitle>
                <CardDescription className="text-gray-300">For restaurant staff only</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600">
                  Manage orders, serve customers, and process payments efficiently.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 rounded-b-lg">
                <Link href="/staff" className="w-full">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                    Staff Login
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Admin Dashboard Card */}
            <Card className="border-gray-200">
              <CardHeader className="bg-gray-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription className="text-gray-300">Restaurant management</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600">
                  Access sales reports, manage menu items, and configure settings.
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 rounded-b-lg">
                <Link href="/admin" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  >
                    Admin Login
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Welcome message */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">Welcome to Mamlaka Grill</h3>
              <p className="text-sm text-gray-600">Enjoy our delicious food with fast and convenient ordering!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with contact information */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Utensils className="mr-2 h-5 w-5" />
                Mamlaka Grill
              </h2>
              <p className="text-gray-400 text-sm">Delicious grilled specialties served with excellence.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact Us</h3>
              <p className="text-gray-400 text-sm">Phone: +254 XXX XXX XXX</p>
              <p className="text-gray-400 text-sm">Email: info@mamlakagrill.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
              <p className="text-gray-400 text-sm">Monday - Sunday: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Mamlaka Grill. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

