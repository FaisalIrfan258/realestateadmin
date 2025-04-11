"use client"

import { useEffect, useState } from "react"
import { fetchPropertyById, updateProperty } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditPropertyPage({ params }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    images: [],
    videos: [],
  })

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true)
        const data = await fetchPropertyById(params.id)
        const property = data.property

        setFormData({
          title: property.title,
          description: property.description,
          price: property.price.toString(),
          location: property.location,
          category: property.category,
          area: property.area,
          bedrooms: property.bedrooms.toString(),
          bathrooms: property.bathrooms.toString(),
          images: property.images || [],
          videos: property.videos || [],
        })

        setAmenities(property.amenities || [])
      } catch (err) {
        console.error("Error loading property:", err)
        setError("Failed to load property details")
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert numeric fields
      const propertyData = {
        ...formData,
        price: Number.parseInt(formData.price, 10),
        bedrooms: Number.parseInt(formData.bedrooms, 10),
        bathrooms: Number.parseInt(formData.bathrooms, 10),
        amenities,
      }

      await updateProperty(params.id, propertyData)
      setSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/properties/${params.id}`)
      }, 2000)
    } catch (err) {
      console.error("Error updating property:", err)
      setError("Failed to update property. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !formData.title) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Property updated successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  placeholder="e.g. 1500 sqft"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Add amenity (e.g. Swimming Pool)"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
              <Button type="button" onClick={handleAddAmenity} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => handleRemoveAmenity(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {amenities.length === 0 && <p className="text-sm text-muted-foreground">No amenities added yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Note: In a real application, you would upload images here.
                </p>
                <Input
                  id="images"
                  type="text"
                  placeholder="Image URL (for demo purposes)"
                  value={formData.images[0] || ""}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videos">Videos</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Note: In a real application, you would upload videos here.
                </p>
                <Input
                  id="videos"
                  type="text"
                  placeholder="Video URL (for demo purposes)"
                  value={formData.videos[0] || ""}
                  onChange={(e) => setFormData({ ...formData, videos: [e.target.value] })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/properties/${params.id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Property"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}

