"use client"

import { useState } from "react"
import { createProperty } from "@/lib/api"
import { uploadToCloudinary } from "@/lib/cloudinary"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, ImageIcon, Video } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState("")

  // Track selected files for preview
  const [selectedImages, setSelectedImages] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(files)
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedVideos(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Upload images to Cloudinary first
      let imageUrls = []
      if (selectedImages && selectedImages.length > 0) {
        console.log('Uploading images to Cloudinary:', selectedImages.length)
        setError("Uploading images...")
        
        for (const image of selectedImages) {
          try {
            const url = await uploadToCloudinary(image, 'image')
            imageUrls.push(url)
            console.log('Image uploaded:', url)
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
            throw new Error(`Failed to upload image: ${image.name}`)
          }
        }
      }

      // Upload videos to Cloudinary
      let videoUrls = []
      if (selectedVideos && selectedVideos.length > 0) {
        console.log('Uploading videos to Cloudinary:', selectedVideos.length)
        setError("Uploading videos...")
        
        for (const video of selectedVideos) {
          try {
            const url = await uploadToCloudinary(video, 'video')
            videoUrls.push(url)
            console.log('Video uploaded:', url)
          } catch (uploadError) {
            console.error('Error uploading video:', uploadError)
            throw new Error(`Failed to upload video: ${video.name}`)
          }
        }
      }

      // Create JSON payload with Cloudinary URLs
      const propertyData = {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        area: formData.area,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        amenities: amenities,
        images: imageUrls,
        videos: videoUrls
      }

      console.log('Sending property data:', propertyData)
      setError("Creating property...")
      const result = await createProperty(propertyData)
      console.log("Property created:", result)
      setSuccess(true)

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
      })
      setAmenities([])
      setSelectedImages([])
      setSelectedVideos([])

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/properties")
      }, 2000)
    } catch (err) {
      console.error("Error creating property:", err)
      setError("Failed to create property. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
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
                <Label htmlFor="price">Price (₨)</Label>
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
                <Label htmlFor="bedrooms">Bedrooms (Optional)</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms (Optional)</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="0"
                  value={formData.bathrooms}
                  onChange={handleChange}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddAmenity()
                  }
                }}
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
              {/* Images Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images" className="text-base font-medium">
                    Property Images
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload multiple images of the property (JPG, PNG)
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium mb-1">Drag and drop images here or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">Maximum 10 images, 5MB each</p>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected Images ({selectedImages.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                            <img
                              src={URL.createObjectURL(file) || "/placeholder.svg"}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newImages = [...selectedImages]
                              newImages.splice(index, 1)
                              setSelectedImages(newImages)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Videos Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="videos" className="text-base font-medium">
                    Property Videos
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">Upload videos showcasing the property (MP4, MOV)</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Video className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium mb-1">Drag and drop videos here or click to browse</p>
                    <p className="text-xs text-muted-foreground mb-4">Maximum 3 videos, 50MB each</p>
                    <Input
                      id="videos"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      multiple
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>

                {/* Video Preview */}
                {selectedVideos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected Videos ({selectedVideos.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedVideos.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video rounded-md overflow-hidden border bg-muted">
                            <video src={URL.createObjectURL(file)} className="h-full w-full object-cover" controls />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newVideos = [...selectedVideos]
                                newVideos.splice(index, 1)
                                setSelectedVideos(newVideos)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mb-10">
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
