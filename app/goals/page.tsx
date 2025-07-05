"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Target,
  Plus,
  Search,
  Filter,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { getGoals, createGoal, updateGoal, deleteGoal, updateGoalProgress } from "@/lib/api"

interface Goal {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  deadline: string
  progress: number
  status: "pending" | "in_progress" | "completed"
  created_at: string
}

interface GoalFormData {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  deadline: string
}

export default function GoalsPage() {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("created_date")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState<GoalFormData>({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadGoals()
  }, [router])

  const loadGoals = async () => {
    try {
      setIsLoading(true)
      const data = await getGoals()
      // ...existing code...
      // Map backend fields to frontend fields
      const mappedGoals = (data.goals || []).map((goal: any) => ({
        id: goal.ID,
        title: goal.Title,
        description: goal.Description,
        priority: goal.Priority,
        deadline: goal.Deadline,
        progress: goal.Progress,
        status: goal.Status,
        created_at: goal.CreatedAt,
      }))
      setGoals(mappedGoals)
    } catch (error) {
      console.error("Error loading goals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    // Simple validation for required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.priority || !formData.deadline) {
      alert("Please fill in all fields before creating a goal.")
      return
    }
    // ...existing code...
    try {
      // Convert deadline to RFC3339 (YYYY-MM-DDTHH:mm:ssZ)
      const deadlineRFC3339 = formData.deadline ? new Date(formData.deadline + 'T23:59:00Z').toISOString() : ""
      await createGoal({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: deadlineRFC3339,
      })
      setIsCreateModalOpen(false)
      setFormData({ title: "", description: "", priority: "medium", deadline: "" })
      loadGoals()
    } catch (error: any) {
      let message = "Error creating goal."
      if (error && typeof error === "object") {
        if (typeof error.message === "string") message = error.message
        else if (typeof error.error === "string") message = error.error
      }
      alert(message)
      console.error("Error creating goal:", error)
    }
  }

  const handleUpdateGoal = async () => {
    if (!editingGoal) return

    // Only send fields required by backend for update
    // Convert deadline to RFC3339 (YYYY-MM-DDTHH:mm:ssZ)
    const deadlineRFC3339 = formData.deadline ? new Date(formData.deadline + 'T23:59:00Z').toISOString() : ""
    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      deadline: deadlineRFC3339,
    }
    try {
      await updateGoal(editingGoal.id, payload)
      setEditingGoal(null)
      setFormData({ title: "", description: "", priority: "medium", deadline: "" })
      loadGoals()
    } catch (error: any) {
      let message = "Error updating goal."
      if (error && typeof error === "object") {
        if (typeof error.message === "string") message = error.message
        else if (typeof error.error === "string") message = error.error
      }
      alert(message)
      console.error("Error updating goal:", error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?")
    if (!confirmed) return

    try {
      setIsLoading(true)
      await deleteGoal(goalId)
      await loadGoals()
    } catch (error: any) {
      let message = "Error deleting goal."
      if (error && typeof error === "object") {
        if (typeof error.message === "string") message = error.message
        else if (typeof error.error === "string") message = error.error
      }
      alert(message)
      console.error("Error deleting goal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProgressUpdate = async (goalId: string, progress: number) => {
    try {
      await updateGoalProgress(goalId, progress)
      loadGoals()
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const filteredGoals = goals.filter((goal) => {
    // Debug: log each goal object
    // ...existing code...
    if (!goal || typeof goal.title !== "string" || typeof goal.description !== "string") {
      return false;
    }
    // Default/fallbacks for missing fields
    const progress = typeof goal.progress === "number" ? goal.progress : 0;
    const status = typeof goal.status === "string" ? goal.status : "pending";

    const matchesSearch =
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && progress === 100) ||
      (filterStatus === "in_progress" && progress > 0 && progress < 100) ||
      (filterStatus === "pending" && progress === 0);

    return matchesSearch && matchesFilter;
  })

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case "created_date":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-500/10"
      case "medium":
        return "border-l-orange-500 bg-orange-500/10"
      case "low":
        return "border-l-green-500 bg-green-500/10"
      default:
        return "border-l-gray-500 bg-gray-500/10"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-orange-600"
      case "low":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      priority: goal.priority,
      deadline: goal.deadline.split("T")[0], // Format for date input
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 p-8">
          <div className="text-white text-xl text-center">Loading your goals...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-purple-100 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">My Goals</h1>
              <p className="text-purple-100">Track and manage your objectives</p>
            </div>
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md bg-slate-900/90 border border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Describe your goal"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateGoal} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Create Goal
                  </Button>
                  <Button
                    onClick={() => setIsCreateModalOpen(false)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                  <Input
                    type="text"
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-purple-300"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_date">Created Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        {sortedGoals.length === 0 ? (
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No goals found</h3>
              <p className="text-purple-100 mb-6">Create your first goal to get started on your journey!</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGoals.map((goal) => (
              <Card
                key={goal.id}
                className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 border-l-4 ${getPriorityColor(goal.priority)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{goal.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityBadgeColor(goal.priority)} text-white text-xs`}>
                          {goal.priority.toUpperCase()}
                        </Badge>
                        {goal.progress === 100 ? (
                          <Badge className="bg-green-600 text-white text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        ) : goal.progress > 0 ? (
                          <Badge className="bg-yellow-600 text-white text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-600 text-white text-xs">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-300 hover:text-white hover:bg-white/10"
                        onClick={() => openEditModal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100 text-sm mb-4 line-clamp-3">{goal.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-100 text-sm">Progress</span>
                      <span className="text-white font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-purple-300">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent text-xs px-2 py-1"
                        onClick={() => handleProgressUpdate(goal.id, Math.min(100, goal.progress + 25))}
                      >
                        +25%
                      </Button>
                      {goal.progress < 100 && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                          onClick={() => handleProgressUpdate(goal.id, 100)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Goal Modal */}
        <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
          <DialogContent className="backdrop-blur-md bg-slate-900/90 border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-deadline">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateGoal} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Update Goal
                </Button>
                <Button
                  onClick={() => setEditingGoal(null)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
