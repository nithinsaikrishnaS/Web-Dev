"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Business {
  id: string
  name: string
  address: string
  city: string
  pincode: string
  contact_person: string
  contact_phone: string
  contact_email: string
  is_active: boolean
  categories: { name: string }
  created_at: string
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          *,
          categories (name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error("Error fetching businesses:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
            <p className="text-muted-foreground">Manage all registered businesses</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Business
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Businesses</CardTitle>
            <CardDescription>A list of all businesses registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{business.categories?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        {business.city}, {business.pincode}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{business.contact_person}</div>
                          <div className="text-muted-foreground">{business.contact_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={business.is_active ? "default" : "secondary"}>
                          {business.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
