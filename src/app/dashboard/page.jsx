"use client"

import { useEffect, useState } from "react"
import { fetchProperties, fetchContacts } from "@/lib/api"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Users, DollarSign, Building } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalContacts: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [propertiesData, contactsData] = await Promise.all([fetchProperties(), fetchContacts()])

        const totalValue = propertiesData.properties.reduce((sum, property) => sum + property.price, 0)

        setStats({
          totalProperties: propertiesData.count,
          totalContacts: contactsData.count,
          totalValue,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Home,
      color: "bg-blue-100 text-blue-600",
      onClick: () => router.push("/dashboard/properties"),
    },
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: Users,
      color: "bg-green-100 text-green-600",
      onClick: () => router.push("/dashboard/contacts"),
    },
    
    {
      title: "Add Property",
      value: "Create New",
      icon: Building,
      color: "bg-amber-100 text-amber-600",
      onClick: () => router.push("/dashboard/properties/add"),
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your real estate admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow`} onClick={stat.onClick}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Button className="w-full" onClick={() => router.push("/dashboard/properties")}>
                View All Properties
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Button className="w-full" onClick={() => router.push("/dashboard/contacts")}>
                View All Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

