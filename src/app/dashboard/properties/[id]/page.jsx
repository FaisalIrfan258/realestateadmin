"use client"

import { useEffect, useState } from "react"
import { fetchPropertyById } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bed, Bath, Home, MapPin, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true)
        const data = await fetchPropertyById(params.id)
        setProperty(data.property)
      } catch (err) {
        console.error("Error loading property:", err)
        setError("Failed to load property details")
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-800">{error || "Property not found"}</div>
      </DashboardLayout>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{property.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {property.images && property.images.length > 0 ? (
                <div className="relative h-64 mb-6 rounded-md overflow-hidden">
                  <Image
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 mb-6 bg-muted flex items-center justify-center rounded-md">
                  <Home className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-sm">
                  {property.category}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Bed className="h-3 w-3 mr-1" /> {property.bedrooms} Bedrooms
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Bath className="h-3 w-3 mr-1" /> {property.bathrooms} Bathrooms
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {property.area}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Price</h3>
                    <div className="flex items-center text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {property.price.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Listed On</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(property.createdAt)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-semibold">Images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.images && property.images.length > 0 ? (
                    property.images.map((image, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 h-24 bg-muted flex items-center justify-center rounded-md">
                      <p className="text-sm text-muted-foreground">No images</p>
                    </div>
                  )}
                </div>

                {property.videos && property.videos.length > 0 && (
                  <>
                    <h3 className="font-semibold mt-4">Videos</h3>
                    <div className="space-y-2">
                      {property.videos.map((video, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden">
                          <video src={video} controls className="w-full h-auto" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

