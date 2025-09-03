"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Truck, CreditCard, FileText, Building, MapPin, Clock } from "lucide-react"

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

const sampleItems: CheckoutItem[] = [
  {
    id: "1",
    name: "Professional Office Chair - Ergonomic Design",
    price: 249.99,
    quantity: 8,
    image: "/professional-office-chair.jpg",
  },
  {
    id: "2",
    name: "Premium Paper Pack - 5000 Sheets",
    price: 39.99,
    quantity: 25,
    image: "/office-paper-stack.jpg",
  },
]

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [formData, setFormData] = useState({
    // Billing Information
    billingCompany: "",
    billingContact: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "US",

    // Shipping Information
    shippingCompany: "",
    shippingContact: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",

    // Order Information
    purchaseOrderNumber: "",
    specialInstructions: "",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const subtotal = sampleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = shippingMethod === "expedited" ? 49.99 : shippingMethod === "overnight" ? 99.99 : 19.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log("Order submitted:", formData)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Billing Information</span>
              </CardTitle>
              <CardDescription>Enter your company's billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billingCompany">Company Name *</Label>
                  <Input
                    id="billingCompany"
                    placeholder="Acme Corporation"
                    value={formData.billingCompany}
                    onChange={(e) => setFormData({ ...formData, billingCompany: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingContact">Contact Name *</Label>
                  <Input
                    id="billingContact"
                    placeholder="John Doe"
                    value={formData.billingContact}
                    onChange={(e) => setFormData({ ...formData, billingContact: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Email Address *</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    placeholder="john@acmecorp.com"
                    value={formData.billingEmail}
                    onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPhone">Phone Number *</Label>
                  <Input
                    id="billingPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.billingPhone}
                    onChange={(e) => setFormData({ ...formData, billingPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Address *</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Business Ave, Suite 100"
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    placeholder="New York"
                    value={formData.billingCity}
                    onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingState">State *</Label>
                  <Input
                    id="billingState"
                    placeholder="NY"
                    value={formData.billingState}
                    onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingZip">ZIP Code *</Label>
                  <Input
                    id="billingZip"
                    placeholder="10001"
                    value={formData.billingZip}
                    onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
              <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sameAsBilling"
                  checked={sameAsBilling}
                  onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                />
                <Label htmlFor="sameAsBilling">Same as billing address</Label>
              </div>

              {!sameAsBilling && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCompany">Company Name</Label>
                      <Input
                        id="shippingCompany"
                        placeholder="Acme Corporation"
                        value={formData.shippingCompany}
                        onChange={(e) => setFormData({ ...formData, shippingCompany: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingContact">Contact Name</Label>
                      <Input
                        id="shippingContact"
                        placeholder="John Doe"
                        value={formData.shippingContact}
                        onChange={(e) => setFormData({ ...formData, shippingContact: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Address</Label>
                    <Input
                      id="shippingAddress"
                      placeholder="123 Business Ave, Suite 100"
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        placeholder="New York"
                        value={formData.shippingCity}
                        onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        placeholder="NY"
                        value={formData.shippingState}
                        onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZip">ZIP Code</Label>
                      <Input
                        id="shippingZip"
                        placeholder="10001"
                        value={formData.shippingZip}
                        onChange={(e) => setFormData({ ...formData, shippingZip: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Method</span>
              </CardTitle>
              <CardDescription>Choose your preferred delivery option</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="flex-1">
                    <Label htmlFor="standard" className="font-medium">
                      Standard Shipping
                    </Label>
                    <p className="text-sm text-muted-foreground">5-7 business days</p>
                  </div>
                  <span className="font-medium">$19.99</span>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="expedited" id="expedited" />
                  <div className="flex-1">
                    <Label htmlFor="expedited" className="font-medium">
                      Expedited Shipping
                    </Label>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                  <span className="font-medium">$49.99</span>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="overnight" id="overnight" />
                  <div className="flex-1">
                    <Label htmlFor="overnight" className="font-medium">
                      Overnight Shipping
                    </Label>
                    <p className="text-sm text-muted-foreground">Next business day</p>
                  </div>
                  <span className="font-medium">$99.99</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Order Information</span>
              </CardTitle>
              <CardDescription>Additional order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseOrderNumber">Purchase Order Number (Optional)</Label>
                <Input
                  id="purchaseOrderNumber"
                  placeholder="PO-2024-001"
                  value={formData.purchaseOrderNumber}
                  onChange={(e) => setFormData({ ...formData, purchaseOrderNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special delivery instructions or requirements"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
              <CardDescription>Secure payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="net-30" id="net-30" />
                  <Label htmlFor="net-30">Net 30 Terms (Approved accounts only)</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing Order..." : `Place Order - $${total.toFixed(2)}`}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleItems.map((item) => (
              <div key={item.id} className="flex space-x-3">
                <div className="relative h-12 w-12 overflow-hidden rounded border">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Estimated Delivery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {shippingMethod === "overnight" ? "Tomorrow" : shippingMethod === "expedited" ? "2-3 Days" : "5-7 Days"}
              </Badge>
              <p className="text-sm text-muted-foreground">Based on your selected shipping method</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
