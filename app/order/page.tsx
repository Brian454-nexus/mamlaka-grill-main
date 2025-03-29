"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  MinusCircle,
  Phone,
  PlusCircle,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

/**
 * Menu Categories and Items
 *
 * This data structure defines all available menu items organized by category.
 * Each item includes an ID, name, price, description, and optional variants (like cold/warm).
 * In a production environment, this would typically come from a database.
 */
const menuCategories = [
  {
    id: "fast-food",
    name: "Fast Food",
    items: [
      {
        id: 1,
        name: "Chips (Regular)",
        price: 150,
        description: "Crispy potato fries",
      },
      {
        id: 2,
        name: "Chips Masala",
        price: 200,
        description: "Fries with special masala spices",
      },
      {
        id: 3,
        name: "Hotdog",
        price: 180,
        description: "Classic hotdog with toppings",
      },
      {
        id: 4,
        name: "Burger",
        price: 250,
        description: "Beef burger with lettuce, tomato and sauce",
      },
      {
        id: 5,
        name: "Sausage",
        price: 100,
        description: "Grilled beef sausage",
      },
      {
        id: 6,
        name: "Chips & Sausage",
        price: 220,
        description: "Combo of fries and sausage",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      // Sodas
      {
        id: 7,
        name: "Coca-Cola",
        price: 80,
        description: "Classic cola flavor",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 8,
        name: "Fanta Orange",
        price: 80,
        description: "Orange flavored soda",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 9,
        name: "Sprite",
        price: 80,
        description: "Lemon-lime flavored soda",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 10,
        name: "Fanta Blackcurrant",
        price: 80,
        description: "Blackcurrant flavored soda",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 11,
        name: "Fanta Pineapple",
        price: 80,
        description: "Pineapple flavored soda",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 12,
        name: "Krest",
        price: 80,
        description: "Bitter lemon flavored soda",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      // Juices
      {
        id: 13,
        name: "Minute Maid Orange",
        price: 100,
        description: "Minute Maid orange juice",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 14,
        name: "Minute Maid Apple",
        price: 100,
        description: "Minute Maid apple juice",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 15,
        name: "Afia Mango",
        price: 100,
        description: "Afia mango juice",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      {
        id: 16,
        name: "Afia Mixed Fruit",
        price: 100,
        description: "Afia mixed fruit juice",
        options: [
          { id: "cold", name: "Cold", default: true },
          { id: "warm", name: "Warm" },
        ],
      },
      // Other drinks
      {
        id: 17,
        name: "Water (500ml)",
        price: 50,
        description: "Mineral water",
      },
      { id: 18, name: "Tea", price: 70, description: "Kenyan tea with milk" },
      {
        id: 19,
        name: "Coffee",
        price: 100,
        description: "Freshly brewed coffee",
      },
    ],
  },
];

/**
 * Order Page Component
 *
 * This component handles the customer ordering process, including:
 * - Collecting customer table number and phone number
 * - Displaying the menu with categories and items
 * - Managing the shopping cart
 * - Submitting orders
 */
export default function OrderPage() {
  const router = useRouter();

  // State for customer information
  const [tableNumber, setTableNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // State for shopping cart
  const [cart, setCart] = useState<
    {
      id: number;
      name: string;
      price: number;
      quantity: number;
      selectedOption?: string;
    }[]
  >([]);

  // State for error messages
  const [error, setError] = useState("");

  /**
   * Add an item to the cart
   *
   * If the item has options (like cold/warm), it uses the default option.
   * If the item already exists in the cart, it increases the quantity.
   *
   * @param item - The menu item to add to the cart
   */
  const addToCart = (item: {
    id: number;
    name: string;
    price: number;
    options?: { id: string; name: string; default?: boolean }[];
    selectedOption?: string;
  }) => {
    // If item has options, use the default option or the first one
    let selectedOption = undefined;
    if (item.options && item.options.length > 0) {
      const defaultOption =
        item.options.find((opt) => opt.default) || item.options[0];
      selectedOption = `${defaultOption.name}`;
    }

    setCart((prevCart) => {
      // For items with options, we need to check if the exact same item with same option exists
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.selectedOption === selectedOption
      );

      if (existingItemIndex >= 0) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            selectedOption,
          },
        ];
      }
    });
  };

  /**
   * Remove an item from the cart
   *
   * If the item quantity is greater than 1, it decreases the quantity.
   * If the quantity is 1, it removes the item from the cart.
   *
   * @param index - The index of the item in the cart array
   */
  const removeFromCart = (index: number) => {
    setCart((prevCart) => {
      const item = prevCart[index];
      if (item.quantity > 1) {
        return prevCart.map((cartItem, idx) =>
          idx === index
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter((_, idx) => idx !== index);
      }
    });
  };

  /**
   * Change the selected option for an item in the cart
   *
   * @param cartIndex - The index of the item in the cart array
   * @param newOption - The new option to set (e.g., "Cold" or "Warm")
   */
  const changeItemOption = (cartIndex: number, newOption: string) => {
    setCart((prevCart) => {
      return prevCart.map((item, index) =>
        index === cartIndex ? { ...item, selectedOption: newOption } : item
      );
    });
  };

  /**
   * Calculate the total price of all items in the cart
   *
   * @returns The total price in KSh
   */
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Validate a Kenyan phone number
   *
   * @param phone - The phone number to validate
   * @returns True if the phone number is valid, false otherwise
   */
  const validatePhoneNumber = (phone: string) => {
    // Basic validation for Kenyan phone numbers
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  /**
   * Handle the submission of an order
   *
   * Validates the table number, phone number, and cart.
   * Creates an order object and stores it in localStorage.
   * Redirects to the confirmation page.
   */
  const handleSubmitOrder = () => {
    // Validate table number
    if (!tableNumber) {
      setError("Please enter your table number");
      return;
    }

    // Validate phone number
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    // Validate cart
    if (cart.length === 0) {
      setError("Your cart is empty. Please add items to your order");
      return;
    }

    // Create order object
    const order = {
      tableNumber,
      phoneNumber,
      items: cart,
      total: calculateTotal(),
      orderTime: new Date().toISOString(),
      status: "pending",
    };

    // Store the order in localStorage for demo purposes
    // In a real app, this would be sent to a database
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const orderId = Date.now().toString();
    orders.push({ id: orderId, ...order });
    localStorage.setItem("orders", JSON.stringify(orders));

    // Redirect to confirmation page
    router.push(`/order/confirmation?id=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation back to home */}
      <header className="bg-green-800 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <Utensils className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-bold">Mamlaka Grill</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="bg-green-800 text-white rounded-t-lg">
            <CardTitle className="text-xl">Place Your Order</CardTitle>
            <CardDescription className="text-green-100">
              Select your table number, phone number and choose your items
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Error alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Customer information inputs */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="table-number">Table Number</Label>
                <Input
                  id="table-number"
                  type="number"
                  placeholder="Enter your table number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPhoneNumber(value);
                      if (!validatePhoneNumber(value)) {
                        setError("Invalid phone number format");
                      } else {
                        setError("");
                      }
                    }}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be used for payment identification
                </p>
              </div>
            </div>

            {/* Menu and cart section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Menu section */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-800">
                  Menu
                </h3>
                <Tabs
                  defaultValue={menuCategories[0].id}
                  className="border rounded-lg p-1 bg-white"
                >
                  {/* Menu category tabs */}
                  <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 rounded-md">
                    {menuCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-green-800 data-[state=active]:text-white"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Menu items by category */}
                  {menuCategories.map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="pt-3"
                    >
                      <ScrollArea className="h-[450px] pr-4">
                        <div className="space-y-3">
                          {category.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md bg-white hover:border-green-200 hover:bg-green-50 transition-colors"
                            >
                              <div className="flex-1 mb-3 md:mb-0">
                                <p className="font-medium text-green-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.description}
                                </p>
                                <p className="text-sm font-medium text-green-800 mt-1">
                                  KSh {item.price}
                                </p>

                                {/* Show options if available (e.g., Cold/Warm) */}
                                {item.options && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.options.map((option) => (
                                      <Badge
                                        key={option.id}
                                        variant="outline"
                                        className={`cursor-pointer py-2 px-3 text-sm ${
                                          option.default ||
                                          cart.some(
                                            (cartItem) =>
                                              cartItem.selectedOption ===
                                              option.name
                                          )
                                            ? "bg-green-100 border-green-300"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          // Find if this item with any option is in cart
                                          const existingItems = cart.filter(
                                            (cartItem) =>
                                              cartItem.id === item.id
                                          );
                                          if (existingItems.length > 0) {
                                            // Update the option for all instances of this item
                                            existingItems.forEach(
                                              (_, index) => {
                                                const cartIndex =
                                                  cart.findIndex(
                                                    (cartItem) =>
                                                      cartItem.id === item.id &&
                                                      cartItem.selectedOption ===
                                                        existingItems[index]
                                                          .selectedOption
                                                  );
                                                if (cartIndex >= 0) {
                                                  changeItemOption(
                                                    cartIndex,
                                                    option.name
                                                  );
                                                }
                                              }
                                            );
                                          } else {
                                            // Add to cart with this option
                                            addToCart({
                                              ...item,
                                              options: undefined,
                                              selectedOption:
                                                option?.name ?? "",
                                            } as {
                                              id: number;
                                              name: string;
                                              price: number;
                                              options?: {
                                                id: string;
                                                name: string;
                                                default?: boolean;
                                              }[];
                                              selectedOption?: string;
                                            });
                                          }
                                        }}
                                      >
                                        {option.name}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button
                                className="bg-green-800 hover:bg-green-900 text-white w-full md:w-auto"
                                size="sm"
                                onClick={() => addToCart(item)}
                              >
                                <PlusCircle className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Cart section */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-800 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" /> Your Order
                  {cart.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items
                    </Badge>
                  )}
                </h3>

                <Card className="border-green-100">
                  <CardContent className="p-4">
                    {/* Empty cart message */}
                    {cart.length === 0 ? (
                      <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-md">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>Your cart is empty</p>
                        <p className="text-sm mt-2">
                          Add items from the menu to get started
                        </p>
                      </div>
                    ) : (
                      /* Cart items list */
                      <ScrollArea className="h-[350px]">
                        <div className="space-y-3">
                          {cart.map((item, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className="flex items-center justify-between py-3 border-b"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-green-900">
                                  {item.name}
                                </p>
                                {item.selectedOption && (
                                  <p className="text-xs text-gray-600">
                                    {item.selectedOption}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">
                                  KSh {item.price} × {item.quantity}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* Decrease quantity button */}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeFromCart(index)}
                                  className="h-9 w-9 border-gray-200"
                                >
                                  <MinusCircle className="h-5 w-5 text-red-500" />
                                </Button>
                                <span className="w-6 text-center font-medium">
                                  {item.quantity}
                                </span>
                                {/* Increase quantity button */}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setCart((prevCart) => {
                                      return prevCart.map((cartItem, idx) =>
                                        idx === index
                                          ? {
                                              ...cartItem,
                                              quantity: cartItem.quantity + 1,
                                            }
                                          : cartItem
                                      );
                                    });
                                  }}
                                  className="h-9 w-9 border-gray-200"
                                >
                                  <PlusCircle className="h-5 w-5 text-green-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {/* Order total */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total:</span>
                        <span className="text-green-800">
                          KSh {calculateTotal().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Payment will be processed via M-PESA after your order is
                        served
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment information */}
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2">
                    Payment Information
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Pay via M-PESA using our paybill:
                  </p>
                  <div className="bg-white p-3 rounded border border-green-200 text-center">
                    <p className="font-medium text-green-900">
                      Paybill: 123456
                    </p>
                    <p className="text-sm text-gray-500">
                      Account: Your Table Number
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 rounded-b-lg border-t">
            <Button
              className="w-full bg-green-800 hover:bg-green-900 text-white h-12 text-lg"
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || !tableNumber || !phoneNumber}
            >
              Place Order
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
