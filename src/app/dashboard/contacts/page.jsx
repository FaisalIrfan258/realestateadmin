"use client"

import { useEffect, useState } from "react"
import { fetchContacts, deleteContact } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Phone, MessageSquare, Trash2, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true)
        const data = await fetchContacts()
        setContacts(data.contacts)
      } catch (err) {
        console.error("Error loading contacts:", err)
        setError("Failed to load contacts")
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.propertyName && contact.propertyName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return

    try {
      await deleteContact(contactToDelete._id)
      setContacts(contacts.filter((c) => c._id !== contactToDelete._id))
      toast({
        title: "Contact deleted",
        description: "The contact has been successfully deleted.",
      })
    } catch (err) {
      console.error("Error deleting contact:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete contact. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setContactToDelete(null)
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contact Queries</h1>
        <p className="text-muted-foreground">Manage inquiries from potential clients</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.propertyName ? (
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                          {contact.propertyName}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatDate(contact.createdAt)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(contact)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
              This will permanently delete the contact from {contactToDelete?.name}. This action cannot be undone.
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

