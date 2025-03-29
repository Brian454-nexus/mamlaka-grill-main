"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, BarChart3, LogOut, PlusCircle, Save, Trash2, Utensils } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Initial menu items data
 *
 * This data structure defines the default menu items available in the system.
 * In a production environment, this would typically come from a database.
 * Each item includes an ID, name, price, and category.
 */
const initialMenuItems = [
  { id: 1, name: "Chips (Regular)", price: 150, category: "fast-food" },
  { id: 2, name: "Chips Masala", price: 200, category: "fast-food" },
  { id: 3, name: "Hotdog", price: 180, category: "fast-food" },
  { id: 4, name: "Burger", price: 250, category: "fast-food" },
  { id: 5, name: "Sausage", price: 100, category: "fast-food" },
  { id: 6, name: "Chips & Sausage", price: 220, category: "fast-food" },
  { id: 7, name: "Coca-Cola", price: 80, category: "drinks" },
  { id: 8, name: "Fanta Orange", price: 80, category: "drinks" },
  { id: 9, name: "Sprite", price: 80, category: "drinks" },
  { id: 10, name: "Fanta Blackcurrant", price: 80, category: "drinks" },
  { id: 11, name: "Fanta Pineapple", price: 80, category: "drinks" },
  { id: 12, name: "Krest", price: 80, category: "drinks" },
  { id: 13, name: "Minute Maid Orange", price: 100, category: "drinks" },
  { id: 14, name: "Minute Maid Apple", price: 100, category: "drinks" },
  { id: 15, name: "Afia Mango", price: 100, category: "drinks" },
  { id: 16, name: "Afia Mixed Fruit", price: 100, category: "drinks" },
  { id: 17, name: "Water (500ml)", price: 50, category: "drinks" },
  { id: 18, name: "Tea", price: 70, category: "drinks" },
  { id: 19, name: "Coffee", price: 100, category: "drinks" },
]

/**
 * Menu categories
 *
 * This defines the available categories for menu items.
 */
const categories = [
  { id: "fast-food", name: "Fast Food" },
  { id: "drinks", name: "Drinks" },
]

/**
 * Admin Dashboard Page Component
 *
 * This component provides the interface for restaurant administrators to:
 * - Manage menu items (add, edit, delete)
 * - View sales reports and analytics
 * - Monitor order status
 * - Export data
 */
export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPin, setAdminPin] = useState("")
  const [error, setError] = useState("")

  // Menu and orders state
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [orders, setOrders] = useState<any[]>([])
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" })

  // Fetch orders and menu items from localStorage when component mounts
  useEffect(() => {
    // In a real app, this would fetch from your API
    // For demo purposes, we're using localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)

    // Load menu items from localStorage if available
    const storedMenuItems = localStorage.getItem("menuItems")
    if (storedMenuItems) {
      setMenuItems(JSON.parse(storedMenuItems))
    }
  }, [])

  /**
   * Handle admin login
   * Validates the PIN and sets authentication state
   */
  const handleLogin = () => {
    // In a real app, this would validate against your backend
    // For demo purposes, we're using a simple PIN: 0000
    if (adminPin === "0000") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid PIN. Please try again.")
    }
  }

  /**
   * Handle admin logout
   * Resets authentication state and PIN
   */
  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminPin("")
  }

  /**
   * Add a new menu item
   * Validates input, creates a new item, and updates state and localStorage
   */
  const handleAddItem = () => {
    // Validate input
    if (!newItem.name || !newItem.price || !newItem.category) {
      setError("Please fill in all fields")
      return
    }

    const price = Number.parseFloat(newItem.price)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      return
    }

    // Create new item with unique ID
    const newId = Math.max(...menuItems.map((item) => item.id), 0) + 1
    const updatedMenuItems = [
      ...menuItems,
      {
        id: newId,
        name: newItem.name,
        price: price,
        category: newItem.category,
      },
    ]

    // Update state and localStorage
    setMenuItems(updatedMenuItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedMenuItems))
    setNewItem({ name: "", price: "", category: "" })
    setError("")
  }

  /**
   * Delete a menu item
   *
   * @param id - The ID of the item to delete
   */
  const handleDeleteItem = (id: number) => {
    const updatedMenuItems = menuItems.filter((item) => item.id !== id)
    setMenuItems(updatedMenuItems)
    localStorage.setItem("menuItems", JSON.stringify(updatedMenuItems))
  }

  // Calculate sales metrics
  const totalSales = orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.status === "paid").length

  // Group orders by table number for analytics
  const ordersByTable = orders.reduce((acc: any, order) => {
    const tableNumber = order.tableNumber
    if (!acc[tableNumber]) {
      acc[tableNumber] = []
    }
    acc[tableNumber].push(order)
    return acc
  }, {})

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md border-gray-800">
          <CardHeader className="bg-gray-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Utensils className="mr-2 h-5 w-5" />
              Mamlaka Grill Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-300">Enter your admin PIN to access the dashboard</CardDescription>
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
                <Label htmlFor="pin">Admin PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">For demo purposes, use PIN: 0000</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg border-t p-4">
            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Main admin dashboard interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <header className="bg-gray-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Utensils className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-bold">Mamlaka Grill Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Sales metrics cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">KSh {totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{completedOrders}</div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Management and Sales Reports tabs */}
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border rounded-lg p-1">
            <TabsTrigger value="menu" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              Sales Reports
            </TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card className="border-green-100">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>Add, edit, or remove items from your menu</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {/* Add new menu item form */}
                  <div className="grid gap-4 md:grid-cols-4 bg-green-50 p-4 rounded-lg border border-green-100">
                    <div>
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input
                        id="item-name"
                        placeholder="e.g., Chips Masala"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="item-price">Price (KSh)</Label>
                      <Input
                        id="item-price"
                        placeholder="e.g., 200"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="item-category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger id="item-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-green-800 hover:bg-green-900 text-white" onClick={handleAddItem}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  {/* Menu items table */}
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{categories.find((c) => c.id === item.category)?.name || item.category}</TableCell>
                          <TableCell>KSh {item.price}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t p-4">
                <Button
                  variant="outline"
                  className="ml-auto border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Sales Reports Tab */}
          <TabsContent value="sales">
            <Card className="border-green-100">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>View your sales data and analytics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Analytics cards */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Orders by Table card */}
                    <Card className="border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Orders by Table</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(ordersByTable).map(([tableNumber, tableOrders]) => (
                            <div key={tableNumber} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                <span>Table {tableNumber}</span>
                              </div>
                              <span>{(tableOrders as any[]).length} orders</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Status card */}
                    <Card className="border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Order Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                              <span>Pending</span>
                            </div>
                            <span>{orders.filter((o) => o.status === "pending").length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                              <span>Served</span>
                            </div>
                            <span>{orders.filter((o) => o.status === "served").length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                              <span>Paid</span>
                            </div>
                            <span>{orders.filter((o) => o.status === "paid").length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Orders table */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-green-800">Recent Orders</h3>
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Table</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 10).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                            <TableCell>Table {order.tableNumber}</TableCell>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>{new Date(order.orderTime).toLocaleTimeString()}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "served"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>KSh {order.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t p-4 flex justify-between">
                <Button
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Full Report
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                    >
                      Export Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Sales Data</DialogTitle>
                      <DialogDescription>Choose a format to export your sales data</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Button variant="outline" className="w-full justify-start">
                        Export as CSV
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Export as PDF
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Export as Excel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

