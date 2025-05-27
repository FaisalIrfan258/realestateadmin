"use client"

import { useEffect, useState } from "react"
import { fetchContacts, deleteContact, fetchContactById } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Phone, MessageSquare, Trash2, Home, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)
  const [contactDetailOpen, setContactDetailOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [loadingContact, setLoadingContact] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [contactsPerPage] = useState(10)

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

  // Get current contacts for pagination
  const indexOfLastContact = currentPage * contactsPerPage
  const indexOfFirstContact = indexOfLastContact - contactsPerPage
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact)
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

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
      toast.success("Contact deleted", {
        description: "The contact has been successfully deleted."
      })
    } catch (err) {
      console.error("Error deleting contact:", err)
      toast.error("Error", {
        description: "Failed to delete contact. Please try again."
      })
    } finally {
      setDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  const openContactDetailModal = async (contactId) => {
    try {
      setLoadingContact(true)
      const data = await fetchContactById(contactId)
      setSelectedContact(data.contact)
      setContactDetailOpen(true)
    } catch (err) {
      console.error("Error fetching contact details:", err)
      toast.error("Error", {
        description: "Failed to load contact details. Please try again."
      })
    } finally {
      setLoadingContact(false)
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
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="w-1/4">Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                currentContacts.map((contact) => (
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
                    <TableCell className="max-w-xs">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{contact.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatDate(contact.createdAt)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openContactDetailModal(contact._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          onClick={() => handleDeleteClick(contact)}
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
        {filteredContacts.length > contactsPerPage && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstContact + 1}-{Math.min(indexOfLastContact, filteredContacts.length)} of {filteredContacts.length} contacts
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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

      <Dialog open={contactDetailOpen} onOpenChange={setContactDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Complete information about this contact query
            </DialogDescription>
          </DialogHeader>
          
          {loadingContact ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : selectedContact ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="mt-1 text-base">{selectedContact.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p className="mt-1 text-base">{selectedContact.phone}</p>
                </div>
                
                {selectedContact.propertyName && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Property</h3>
                    <p className="mt-1 text-base">{selectedContact.propertyName}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <p className="mt-1 text-base leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="mt-1 text-base">
                    {formatDate(selectedContact.createdAt)} at {new Date(selectedContact.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-red-500">Failed to load contact details</div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

