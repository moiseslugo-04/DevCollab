"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Upload, FileDown } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { PRODUCTS, type Product } from "@/lib/products"

export default function AdminProductsPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/")
    }
  }, [router])

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = () => {
    // Mock save - in real app would update state/database
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  return (
    <DashboardLayout title="Products Management" description="Manage products, materials, and templates">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products Catalog</h2>
          <p className="text-muted-foreground">Create and manage products available for resellers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details and materials" : "Add a new product to the catalog"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" defaultValue={editingProduct?.name} placeholder="Business Cards" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={editingProduct?.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="flyers">Flyers</SelectItem>
                      <SelectItem value="banners">Banners</SelectItem>
                      <SelectItem value="brochures">Brochures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={editingProduct?.description}
                  placeholder="Enter product description"
                />
              </div>

              <div className="space-y-2">
                <Label>Template Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="Width" defaultValue={editingProduct?.templateSize.width} />
                  <Input type="number" placeholder="Height" defaultValue={editingProduct?.templateSize.height} />
                  <Select defaultValue={editingProduct?.templateSize.unit || "mm"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trim Area Settings</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="bleed" className="text-xs text-muted-foreground">
                      Bleed (mm)
                    </Label>
                    <Input id="bleed" type="number" placeholder="3" defaultValue={editingProduct?.trimArea.bleed} />
                  </div>
                  <div>
                    <Label htmlFor="safeZone" className="text-xs text-muted-foreground">
                      Safe Zone (mm)
                    </Label>
                    <Input
                      id="safeZone"
                      type="number"
                      placeholder="5"
                      defaultValue={editingProduct?.trimArea.safeZone}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Template File (Gabarito)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <Label htmlFor="template-upload" className="cursor-pointer text-primary hover:text-primary/80">
                    Click to upload template file
                  </Label>
                  <Input id="template-upload" type="file" accept=".pdf,.ai,.psd" className="hidden" />
                  <p className="text-xs text-muted-foreground mt-1">PDF, AI, or PSD format</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Materials & Compatible Finishing</Label>
                <div className="border rounded-lg p-3 space-y-2 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Materials and their compatible finishing options are managed per product
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Plus className="mr-2 h-3 w-3" />
                    Add Material
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="mt-1">{product.description}</CardDescription>
                </div>
                <Badge>{product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground">Template Size:</p>
                <p className="font-medium">
                  {product.templateSize.width} x {product.templateSize.height} {product.templateSize.unit}
                </p>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Materials:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.materials.map((material) => (
                    <Badge key={material.id} variant="outline" className="text-xs">
                      {material.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Trim Settings:</p>
                <p className="font-medium text-xs">
                  Bleed: {product.trimArea.bleed}mm, Safe Zone: {product.trimArea.safeZone}mm
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <FileDown className="mr-2 h-3 w-3" />
                  Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
