"use client"

import { useState } from "react"
import { createProperty } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function AddPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = new FormData()
    try {
      // Append form data
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("price", formData.price)
      form.append("location", formData.location)
      form.append("category", formData.category)
      form.append("area", formData.area)
      form.append("bedrooms", formData.bedrooms)
      form.append("bathrooms", formData.bathrooms)
      
      // Append amenities as a comma-separated string
      if (amenities.length > 0) {
        form.append("amenities", amenities.join(","))
      }

      // Append images
      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          form.append("images", formData.images[i])
        }
      }

      // Append videos
      if (formData.videos && formData.videos.length > 0) {
        for (let i = 0; i < formData.videos.length; i++) {
          form.append("videos", formData.videos[i])
        }
      }

      await createProperty(form)
      setSuccess(true)
      toast.success("Success", {
        description: "Property created successfully!"
      })

      // Reset form
      setFormData({
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
      setAmenities([])

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/properties")
      }, 2000)
    } catch (err) {
      console.error("Error creating property:", err)
      setError("Failed to create property. Please try again.")
      toast.error("Error", {
        description: "Failed to create property. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleRemoveVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add New Property</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Property created successfully! Redirecting...</AlertDescription>
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
                    <SelectItem value="Villa">Shop</SelectItem>
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
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <p className="text-sm text-muted-foreground mb-2">Upload images for the property (supports multiple files).</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files)
                        setFormData((prev) => ({
                          ...prev,
                          images: [...(prev.images || []), ...newFiles]
                        }))
                      }}
                      multiple
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected images ({formData.images.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Array.from(formData.images).map((image, index) => (
                        <div key={`image-${index}`} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover transition-all hover:scale-105"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs truncate mt-1">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="videos">Videos</Label>
                <p className="text-sm text-muted-foreground mb-2">Upload videos for the property (supports multiple files).</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      id="videos"
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files)
                        setFormData((prev) => ({
                          ...prev,
                          videos: [...(prev.videos || []), ...newFiles]
                        }))
                      }}
                      multiple
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                
                {formData.videos && formData.videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected videos ({formData.videos.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array.from(formData.videos).map((video, index) => (
                        <div key={`video-${index}`} className="relative group">
                          <div className="aspect-video rounded-md overflow-hidden border bg-muted">
                            <video
                              src={URL.createObjectURL(video)}
                              className="h-full w-full object-cover"
                              controls
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs truncate mt-1">{video.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/properties")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Property"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
