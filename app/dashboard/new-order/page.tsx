"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  Package,
  Settings,
  Send,
  Download,
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { PRODUCTS, FINISHING_OPTIONS, getProductById, getCompatibleFinishing, type Product } from "@/lib/products"
import { validateArtwork, type ArtworkValidationResult } from "@/lib/artwork-validator"
import { createOrder } from "@/lib/orders"

type Step = 1 | 2 | 3 | 4

export default function NewOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isProcessing, setIsProcessing] = useState(false)

  // Step 1: Artwork Upload
  const [artworkFile, setArtworkFile] = useState<File | null>(null)
  const [artworkValidation, setArtworkValidation] = useState<ArtworkValidationResult | null>(null)

  // Step 2: Product Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")

  // Step 3: Finishing Options
  const [quantity, setQuantity] = useState<number>(100)
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([])

  // Step 4: Review
  const [orderNotes, setOrderNotes] = useState<string>("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "reseller") {
      router.push("/")
    }
  }, [router])

  const handleDownloadTemplate = () => {
    if (!selectedProduct) return

    // Mock template download - in real app would download actual file
    const link = document.createElement("a")
    link.href = `/placeholder.svg?height=400&width=400&query=template-${selectedProduct.id}`
    link.download = `${selectedProduct.name.toLowerCase().replace(/\s+/g, "-")}-template.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF, PNG, or JPG file")
      return
    }

    setIsProcessing(true)
    setArtworkFile(file)

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, use a default template size for validation
    const result = validateArtwork(file, { width: 90, height: 50, unit: "mm" }, { bleed: 3, safeZone: 5 })

    setArtworkValidation(result)
    setIsProcessing(false)
  }

  const handleProductSelect = (productId: string) => {
    const product = getProductById(productId)
    if (product) {
      setSelectedProduct(product)
      setSelectedMaterial("")
      setSelectedFinishing([])

      // Re-validate artwork with product template size
      if (artworkFile) {
        const result = validateArtwork(artworkFile, product.templateSize, product.trimArea)
        setArtworkValidation(result)
      }
    }
  }

  const handleFinishingToggle = (finishingId: string) => {
    setSelectedFinishing((prev) =>
      prev.includes(finishingId) ? prev.filter((id) => id !== finishingId) : [...prev, finishingId],
    )
  }

  const calculateTotal = () => {
    let base = quantity * 0.25 // Mock base price
    selectedFinishing.forEach((fId) => {
      const finishing = FINISHING_OPTIONS.find((f) => f.id === fId)
      if (finishing) base += finishing.additionalCost
    })
    if (artworkValidation?.status === "needs-adjustment") {
      base += 25 // Additional cost for manual adjustment
    }
    return base
  }

  const handleSubmitOrder = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser || !selectedProduct || !artworkFile || !artworkValidation) return

    setIsProcessing(true)

    const material = selectedProduct.materials.find((m) => m.id === selectedMaterial)

    const order = await createOrder({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      materialId: selectedMaterial,
      materialName: material?.name || "",
      quantity,
      finishingOptions: selectedFinishing,
      artworkFile: {
        name: artworkFile.name,
        size: artworkFile.size,
        type: artworkFile.type,
        url: URL.createObjectURL(artworkFile),
      },
      artworkStatus: artworkValidation.status,
      artworkNotes: artworkValidation.status === "needs-adjustment" ? artworkValidation.messages.join("; ") : undefined,
      totalCost: calculateTotal(),
      status: "pending",
    })

    // Mock email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsProcessing(false)

    router.push(`/dashboard/payment?orderId=${order.id}`)
  }

  const canProceedStep1 = artworkFile && artworkValidation
  const canProceedStep2 = selectedProduct && selectedMaterial
  const canProceedStep3 = quantity > 0

  const progress = (currentStep / 4) * 100

  const steps = [
    { number: 1, name: "Upload Artwork", icon: Upload },
    { number: 2, name: "Select Product", icon: Package },
    { number: 3, name: "Choose Options", icon: Settings },
    { number: 4, name: "Review & Submit", icon: Send },
  ]

  return (
    <DashboardLayout title="Create New Order" description="Follow the steps to create your print order">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                </div>
                <span
                  className={`text-sm font-medium text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Upload Artwork */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Artwork</CardTitle>
            <CardDescription>Upload PDF, PNG, or JPG files. We'll validate your artwork automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <Label
                htmlFor="artwork-upload"
                className="cursor-pointer text-primary hover:text-primary/80 font-medium text-lg"
              >
                Click to upload or drag and drop
              </Label>
              <Input
                id="artwork-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <p className="text-sm text-muted-foreground mt-2">PDF, PNG or JPG (MAX. 50MB)</p>
            </div>

            {isProcessing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Validating your artwork...</AlertDescription>
              </Alert>
            )}

            {artworkFile && artworkValidation && (
              <div className="space-y-4">
                <Alert
                  variant={artworkValidation.status === "ok" ? "default" : "destructive"}
                  className={
                    artworkValidation.status === "ok"
                      ? "border-green-500 text-green-700 bg-green-50"
                      : "border-amber-500 text-amber-700 bg-amber-50"
                  }
                >
                  {artworkValidation.status === "ok" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <p className="font-semibold mb-2">
                      {artworkValidation.status === "ok"
                        ? "Artwork OK for production"
                        : "Artwork requires manual adjustment"}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {artworkValidation.messages.map((msg, idx) => (
                        <li key={idx} className="text-sm">
                          {msg}
                        </li>
                      ))}
                    </ul>
                    {artworkValidation.status === "needs-adjustment" && (
                      <p className="text-sm mt-2 font-medium">Additional cost: $25.00 for manual adjustment</p>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{artworkFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(artworkFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Badge variant={artworkValidation.status === "ok" ? "default" : "secondary"}>
                    {artworkValidation.status === "ok" ? "Ready" : "Needs Review"}
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceedStep1}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Product Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Product & Material</CardTitle>
            <CardDescription>Choose the product type and material for your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Product Type</Label>
              <RadioGroup value={selectedProduct?.id || ""} onValueChange={handleProductSelect}>
                <div className="grid gap-4 md:grid-cols-2">
                  {PRODUCTS.map((product) => (
                    <div key={product.id} className="relative">
                      <RadioGroupItem value={product.id} id={product.id} className="peer sr-only" />
                      <Label
                        htmlFor={product.id}
                        className="flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Template: {product.templateSize.width}x{product.templateSize.height}
                              {product.templateSize.unit}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {selectedProduct && (
              <Alert className="bg-blue-50 border-blue-200">
                <Download className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-900">Need the template file?</p>
                      <p className="text-sm text-blue-700">Download the correct gabarito for {selectedProduct.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadTemplate}
                      className="ml-4 bg-transparent"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {selectedProduct && (
              <div>
                <Label className="text-base font-semibold mb-4 block">Material</Label>
                <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <div className="space-y-3">
                    {selectedProduct.materials.map((material) => (
                      <div key={material.id} className="relative">
                        <RadioGroupItem value={material.id} id={material.id} className="peer sr-only" />
                        <Label
                          htmlFor={material.id}
                          className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">{material.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!canProceedStep2}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Finishing Options */}
      {currentStep === 3 && selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Quantity & Finishing Options</CardTitle>
            <CardDescription>Select quantity and compatible finishing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="quantity" className="text-base font-semibold">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                className="mt-2 max-w-xs"
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">Finishing Options</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Only compatible options for your selected material are shown
              </p>
              <div className="space-y-3">
                {getCompatibleFinishing(selectedMaterial, selectedProduct.id).map((finishing) => (
                  <div
                    key={finishing.id}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleFinishingToggle(finishing.id)}
                  >
                    <Checkbox
                      id={finishing.id}
                      checked={selectedFinishing.includes(finishing.id)}
                      onCheckedChange={() => handleFinishingToggle(finishing.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={finishing.id} className="cursor-pointer font-medium">
                        {finishing.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{finishing.description}</p>
                      <p className="text-sm font-medium text-accent mt-1">+${finishing.additionalCost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {getCompatibleFinishing(selectedMaterial, selectedProduct.id).length === 0 && (
                  <p className="text-sm text-muted-foreground p-4 border rounded-lg">
                    No finishing options available for this material
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} disabled={!canProceedStep3}>
                Review Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && selectedProduct && artworkFile && artworkValidation && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Order</CardTitle>
            <CardDescription>Please review your order details before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Product</Label>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Material</Label>
                  <p className="font-medium">
                    {selectedProduct.materials.find((m) => m.id === selectedMaterial)?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Quantity</Label>
                  <p className="font-medium">{quantity}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Artwork File</Label>
                  <p className="font-medium">{artworkFile.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Artwork Status</Label>
                  <Badge variant={artworkValidation.status === "ok" ? "default" : "secondary"} className="mt-1">
                    {artworkValidation.status === "ok" ? "OK for production" : "Needs manual adjustment"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Finishing Options</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedFinishing.length === 0 ? (
                      <p className="text-sm text-muted-foreground">None selected</p>
                    ) : (
                      selectedFinishing.map((fId) => {
                        const finishing = FINISHING_OPTIONS.find((f) => f.id === fId)
                        return (
                          <Badge key={fId} variant="outline">
                            {finishing?.name}
                          </Badge>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Estimated Total:</span>
                <span className="text-2xl text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Payment required before production begins</p>
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes for your order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmitOrder} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
