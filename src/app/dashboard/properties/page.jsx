"use client"

import { useEffect, useState } from "react"
import { fetchProperties, deleteProperty } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Search, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true)
        const data = await fetchProperties()
        setProperties(data.properties)
      } catch (err) {
        console.error("Error loading properties:", err)
        setError("Failed to load properties")
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return

    try {
      await deleteProperty(propertyToDelete._id)
      setProperties(properties.filter((p) => p._id !== propertyToDelete._id))
      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      })
    } catch (err) {
      console.error("Error deleting property:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete property. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPropertyToDelete(null)
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 p-4 rounded-md text-red-800">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button asChild>
          <Link href="/dashboard/properties/add">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No properties found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.category}</Badge>
                    </TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>${property.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {property.bedrooms} beds • {property.bathrooms} baths
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/properties/${property._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/properties/edit/${property._id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(property)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the property "{propertyToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

