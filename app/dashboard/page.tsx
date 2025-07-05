"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  Target,
  Calendar,
  Bell,
  Settings,
  Crown,
  User,
  MessageSquare,
  Bot,
  Users,
  Plus,
  Search,
  Home,
  Clock,
  Activity,
} from "lucide-react"
import { getDashboard, getNotifications } from "@/lib/api"

interface DashboardData {
  user: {
    id: string
    name: string
    email: string
    role: string
    subscription_status?: string
    created_at?: string
  }
  teams: Array<{
    id: string
    name: string
    member_count: number
    unread_messages: number
  }>
  goals: Array<{
    id: string
    title: string
    progress: number
    priority: string
    deadline: string
  }>
  calendar: Array<{
    id: string
    title: string
    start_time: string
    end_time: string
  }>
  chat: Array<{
    id: string
    message: string
    sender_name: string
    timestamp: string
  }>
  summary: string
}

interface NotificationData {
  id: string
  message: string
  read: boolean
  timestamp: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      try {
        // Load dashboard data
        const dashData = await getDashboard()
        setDashboardData(dashData)

        // Load notifications
        const notifData = await getNotifications()
        setNotifications(notifData)
      } catch (error) {
        console.error("Error loading dashboard:", error)
        // Fallback to stored user data if API fails
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          setDashboardData({
            user,
            teams: [],
            goals: [],
            calendar: [],
            chat: [],
            summary: "Welcome to your dashboard!",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 p-8">
          <div className="text-white text-xl text-center">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length
  const completedGoals = dashboardData.goals.filter((g) => g.progress === 100).length
  const pendingGoals = dashboardData.goals.filter((g) => g.progress < 100).length
  const todayEvents = dashboardData.calendar?.filter(
  (e) => new Date(e.start_time).toDateString() === new Date().toDateString(),
)?.length || 0


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
      {/* Navigation Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 backdrop-blur-md bg-white/10 border-r border-white/20 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-8">
            AssistDeck🧱
          </h1>

          {/* User Profile */}
          <div className="flex items-center space-x-3 mb-8 p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-purple-600 text-white">
                {dashboardData.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{dashboardData.user.name}</p>
              <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                {dashboardData.user.role === "student" ? "Student" : "Entrepreneur"}
              </Badge>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-600/20 text-white"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/goals"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Target className="h-5 w-5" />
              <span>Goals</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Teams</span>
            </Link>
            <Link
              href="/calendar"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            <Link
              href="/chat"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat</span>
            </Link>
            <Link
              href="/ai-assistant"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bot className="h-5 w-5" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:text-white hover:bg-white/10"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header Bar */}
        <header className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-purple-100">Welcome back, {dashboardData.user.name}!</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 w-64"
                />
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-purple-100 hover:text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-purple-600 text-white text-sm">
                  {dashboardData.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-6">
          {/* AI Summary */}
          {dashboardData.summary && (
            <Card className="mb-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Bot className="h-6 w-6 text-purple-400" />
                  <p className="text-purple-100">{dashboardData.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5 text-purple-400" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {dashboardData.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold">{dashboardData.user.name}</h3>
                    <Badge className="bg-purple-600 text-white">
                      {dashboardData.user.role === "student" ? (
                        <>Student Plan</>
                      ) : (
                        <>
                          Entrepreneur Plan <Crown className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                {dashboardData.user.created_at && (
                  <p className="text-purple-100 text-sm mb-3">
                    Member since {new Date(dashboardData.user.created_at).toLocaleDateString()}
                  </p>
                )}
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  Quick Settings
                </Button>
              </CardContent>
            </Card>

            {/* Goals Overview Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Target className="mr-2 h-5 w-5 text-purple-400" />
                  Goals Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Total Goals</span>
                    <span className="text-2xl font-bold text-white">{dashboardData.goals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Completed</span>
                    <span className="text-xl font-semibold text-green-400">{completedGoals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">In Progress</span>
                    <span className="text-xl font-semibold text-yellow-400">{pendingGoals}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${dashboardData.goals.length > 0 ? (completedGoals / dashboardData.goals.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <Link href="/goals">
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      View All Goals
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AI Chat Preview Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-purple-400" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-100 text-sm">
                      "Ready to help you achieve your goals! Ask me anything about productivity, planning, or project
                      management."
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">AI Online</span>
                  </div>
                  <Link href="/ai-assistant">
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Open Full Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-purple-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Today's Events</span>
                    <Badge className="bg-blue-600 text-white">{todayEvents}</Badge>
                  </div>
                  {(dashboardData.calendar && Array.isArray(dashboardData.calendar) ? dashboardData.calendar.slice(0, 3) : []).map((event, index) => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{event.title}</p>
                        <p className="text-purple-300 text-xs">
                          {new Date(event.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/calendar">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Activity Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5 text-purple-400" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.teams.length > 0 ? (
                    <>
                      {dashboardData.teams.slice(0, 3).map((team) => (
                        <div key={team.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {team.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{team.name}</p>
                              <p className="text-purple-300 text-xs">{team.member_count} members</p>
                            </div>
                          </div>
                          {team.unread_messages > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">{team.unread_messages}</Badge>
                          )}
                        </div>
                      ))}
                      <Link href="/teams">
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                          View Teams
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Users className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-100 text-sm mb-3">No teams yet</p>
                      <Link href="/teams">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          Create Team
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/goals">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Create New Goal
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 justify-start bg-transparent"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Event
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 justify-start bg-transparent"
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    Start AI Chat
                  </Button>
                </Link>
                {dashboardData.user.role === "entrepreneur" && (
                  <Link href="/teams">
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 justify-start bg-transparent"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Invite Team Member
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section */}
          {dashboardData.chat && Array.isArray(dashboardData.chat) && dashboardData.chat.length > 0 && (
            <Card className="mt-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.chat.slice(0, 5).map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-600 text-white text-sm">
                          {message.sender_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-white text-sm font-medium">{message.sender_name}</p>
                          <p className="text-purple-300 text-xs">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <p className="text-purple-100 text-sm mt-1">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
