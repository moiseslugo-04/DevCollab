"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Copy, CreditCard, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getOrderById } from "@/lib/orders"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "bank">("pix")
  const [copied, setCopied] = useState(false)

  // Mock payment details
  const pixKey = "printshop@demo.com"
  const bankDetails = {
    bank: "Demo Bank",
    account: "123456-7",
    routing: "001",
    beneficiary: "Print Shop Demo Ltd",
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "reseller") {
      router.push("/")
      return
    }

    if (orderId) {
      const foundOrder = getOrderById(orderId)
      setOrder(foundOrder)
    }
  }, [router, orderId])

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentConfirmed = () => {
    router.push("/dashboard?payment=success")
  }

  if (!order) {
    return (
      <DashboardLayout title="Payment Required" description="Complete payment to process your order">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading order details...</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Payment Required" description="Complete payment to process your order">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Order Summary */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <p className="font-semibold text-amber-900">Payment Required</p>
            <p className="text-sm text-amber-700">
              Your order has been created successfully. Please complete the payment to start production.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order #{order.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{order.productName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material:</span>
                <span className="font-medium">{order.materialName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Artwork Status:</span>
                <Badge variant={order.artworkStatus === "ok" ? "default" : "secondary"} className="text-xs">
                  {order.artworkStatus === "ok" ? "Ready" : "Needs Review"}
                </Badge>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">${order.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
              <CardDescription>Choose your payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === "pix" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("pix")}
                  className="h-auto py-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">PIX</span>
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === "bank" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("bank")}
                  className="h-auto py-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Bank Transfer</span>
                  </div>
                </Button>
              </div>

              {paymentMethod === "pix" && (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">PIX Key (Email):</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-background rounded text-sm">{pixKey}</code>
                      <Button size="sm" variant="outline" onClick={() => handleCopyToClipboard(pixKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use the PIX key above to complete your payment. Payment is usually confirmed within minutes.
                  </p>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium">{bankDetails.bank}</span>
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-medium">{bankDetails.account}</span>
                      <span className="text-muted-foreground">Routing:</span>
                      <span className="font-medium">{bankDetails.routing}</span>
                      <span className="text-muted-foreground">Beneficiary:</span>
                      <span className="font-medium">{bankDetails.beneficiary}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bank transfers may take 1-2 business days to process. Include your order number in the transfer
                    reference.
                  </p>
                </div>
              )}

              {copied && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 text-sm">Copied to clipboard!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mock Payment Confirmation */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Demo: Simulate Payment</CardTitle>
            <CardDescription>This is a demo environment. Click below to simulate successful payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePaymentConfirmed} className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Confirm Payment (Demo)
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
