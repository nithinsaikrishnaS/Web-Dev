"use client"

import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native"
import { supabase } from "../contexts/AuthContext"
import { useAuth } from "../contexts/AuthContext"

interface AuditTask {
  id: string
  title: string
  description: string
  status: string
  payout_amount: number
  scheduled_date: string
  businesses: {
    name: string
    address: string
  }
}

export default function TaskListScreen({ navigation }: any) {
  const { profile } = useAuth()
  const [tasks, setTasks] = useState<AuditTask[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_tasks")
        .select(`
          *,
          businesses (name, address)
        `)
        .eq("auditor_id", profile?.id)
        .order("scheduled_date", { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchTasks().then(() => setRefreshing(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "in_progress":
        return "#3b82f6"
      case "completed":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const renderTask = ({ item }: { item: AuditTask }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => navigation.navigate("Audit", { task: item })}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace("_", " ")}</Text>
        </View>
      </View>

      <Text style={styles.businessName}>{item.businesses?.name}</Text>
      <Text style={styles.businessAddress}>{item.businesses?.address}</Text>

      <View style={styles.taskFooter}>
        <Text style={styles.payoutAmount}>${item.payout_amount}</Text>
        <Text style={styles.scheduledDate}>{new Date(item.scheduled_date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks assigned yet</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  businessName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  businessAddress: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
  },
  scheduledDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
})
