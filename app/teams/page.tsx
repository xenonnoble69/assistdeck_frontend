// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/lib/auth" // Your auth context
// import { toast } from "@/components/ui/use-toast" // Your toast notification system
// import {
//   Users,
//   MessageCircle,
//   Plus,
//   Send,
//   Crown,
//   Shield,
//   User,
//   AlertCircle,
//   Loader2,
//   Wifi,
//   WifiOff,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// // Types
// interface TeamMember {
//   id: string
//   name: string
//   email: string
//   role: string
//   joined_at: string
// }

// interface ApiTeam {
//   id: string
//   name: string
//   role: string
//   member_count: number
//   created_at: string
// }

// interface ApiTeamDetails {
//   id: string
//   name: string
//   created_at: string
//   your_role: string
//   members: TeamMember[]
// }

// interface ChatMessage {
//   id: string
//   message: string
//   senderID: string
//   teamID: string
//   createdAt: string
//   senderName: string
// }

// export default function TeamChatPage() {
//   const { user, token } = useAuth()
  
//   if (!user || !token) {
//     return <div>Loading...</div>
//   }
//   const router = useRouter()
//   const { user: authUser, token } = useAuth()
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

//   // State
//   const [activeTab, setActiveTab] = useState<"teams" | "chat">("teams")
//   const [teams, setTeams] = useState<ApiTeam[]>([])
//   const [selectedTeam, setSelectedTeam] = useState<ApiTeamDetails | null>(null)
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [newMessage, setNewMessage] = useState("")
//   const [newTeamName, setNewTeamName] = useState("")
//   const [inviteEmail, setInviteEmail] = useState("")
//   const [inviteRole, setInviteRole] = useState("member")
//   const [isOnline, setIsOnline] = useState(navigator.onLine)

//   // Loading states
//   const [loading, setLoading] = useState({
//     teams: false,
//     teamDetails: false,
//     messages: false,
//     sendMessage: false,
//     createTeam: false,
//     invite: false,
//   })

//   // Auth verification
//   useEffect(() => {
//     if (!authUser || !token) {
//       router.push("/login")
//     }
//   }, [authUser, token, router])

//   // Network status monitoring
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)

//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)

//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   // API helper function
//   const makeApiCall = useCallback(
//     async (endpoint: string, options: RequestInit = {}) => {
//       if (!isOnline) {
//         throw new Error("You are offline. Please check your internet connection.")
//       }

//       const response = await fetch(`${apiBaseUrl}${endpoint}`, {
//         ...options,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           ...options.headers,
//         },
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.error || `Request failed with status ${response.status}`)
//       }

//       return response.json()
//     },
//     [apiBaseUrl, token, isOnline]
//   )

//   // Error handler
//   const handleError = useCallback((err: unknown, context: string) => {
//     const errorMessage = err instanceof Error ? err.message : `${context} failed`
//     toast({
//       variant: "destructive",
//       title: "Error",
//       description: errorMessage,
//     })
//     console.error(`${context} error:`, err)
//   }, [toast])

//   // Load teams
//   const loadTeams = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, teams: true }))
//     try {
//       const data = await makeApiCall("/teams")
//       setTeams(data.teams || [])
//     } catch (err) {
//       handleError(err, "Load teams")
//     } finally {
//       setLoading((prev) => ({ ...prev, teams: false }))
//     }
//   }, [makeApiCall, handleError])

//   // Load team details
//   const loadTeamDetails = useCallback(
//     async (teamId: string): Promise<ApiTeamDetails | null> => {
//       setLoading((prev) => ({ ...prev, teamDetails: true }))
//       try {
//         const data = await makeApiCall(`/teams/${teamId}`)
//         const teamDetails = data.team
//         setSelectedTeam(teamDetails)
//         return teamDetails
//       } catch (err) {
//         handleError(err, "Load team details")
//         return null
//       } finally {
//         setLoading((prev) => ({ ...prev, teamDetails: false }))
//       }
//     },
//     [makeApiCall, handleError]
//   )

//   // Load messages
//   const loadMessages = useCallback(
//     async (teamId: string, teamMembers: TeamMember[], silent = false) => {
//       if (!silent) {
//         setLoading((prev) => ({ ...prev, messages: true }))
//       }
//       try {
//         const apiMessages = await makeApiCall(`/chat/${teamId}`)
//         const messagesArray = Array.isArray(apiMessages) ? apiMessages : []

//         // Resolve sender names
//         const messagesWithSenders = messagesArray.map((msg: any) => {
//           const sender = teamMembers.find((member) => member.id === msg.senderID)
//           return {
//             ...msg,
//             senderName: sender?.name || "Unknown User",
//           }
//         })

//         setMessages(messagesWithSenders)
//       } catch (err) {
//         handleError(err, "Load messages")
//       } finally {
//         if (!silent) {
//           setLoading((prev) => ({ ...prev, messages: false }))
//         }
//       }
//     },
//     [makeApiCall, handleError]
//   )

//   // Send message
//   const handleSendMessage = useCallback(async () => {
//     if (!newMessage.trim() || !selectedTeam || !authUser) return

//     setLoading((prev) => ({ ...prev, sendMessage: true }))
//     try {
//       await makeApiCall("/chat", {
//         method: "POST",
//         body: JSON.stringify({
//           team_id: selectedTeam.id,
//           message: newMessage.trim(),
//           sender_id: authUser.id,
//         }),
//       })

//       setNewMessage("")
//       await loadMessages(selectedTeam.id, selectedTeam.members, true)
//     } catch (err) {
//       handleError(err, "Send message")
//     } finally {
//       setLoading((prev) => ({ ...prev, sendMessage: false }))
//     }
//   }, [newMessage, selectedTeam, authUser, makeApiCall, handleError, loadMessages])

//   // Create team
//   const handleCreateTeam = useCallback(async () => {
//     if (!newTeamName.trim()) return

//     setLoading((prev) => ({ ...prev, createTeam: true }))
//     try {
//       await makeApiCall("/teams", {
//         method: "POST",
//         body: JSON.stringify({ name: newTeamName }),
//       })

//       setNewTeamName("")
//       await loadTeams()
//       toast({
//         title: "Team created",
//         description: `${newTeamName} has been successfully created`,
//       })
//     } catch (err) {
//       handleError(err, "Create team")
//     } finally {
//       setLoading((prev) => ({ ...prev, createTeam: false }))
//     }
//   }, [newTeamName, makeApiCall, handleError, loadTeams, toast])

//   // Invite user
//   const handleInviteUser = useCallback(async () => {
//     if (!inviteEmail.trim() || !selectedTeam) return

//     setLoading((prev) => ({ ...prev, invite: true }))
//     try {
//       await makeApiCall(`/teams/${selectedTeam.id}/invite`, {
//         method: "POST",
//         body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
//       })

//       setInviteEmail("")
//       await loadTeamDetails(selectedTeam.id)
//       toast({
//         title: "Invitation sent",
//         description: `${inviteEmail} has been invited to ${selectedTeam.name}`,
//       })
//     } catch (err) {
//       handleError(err, "Send invitation")
//     } finally {
//       setLoading((prev) => ({ ...prev, invite: false }))
//     }
//   }, [inviteEmail, inviteRole, selectedTeam, makeApiCall, handleError, loadTeamDetails, toast])

//   // Handle team selection
//   const handleTeamSelect = useCallback(
//     async (team: ApiTeam) => {
//       try {
//         const teamDetails = await loadTeamDetails(team.id)
//         if (teamDetails && activeTab === "chat") {
//           await loadMessages(teamDetails.id, teamDetails.members)
//         }
//       } catch (err) {
//         handleError(err, "Select team")
//       }
//     },
//     [loadTeamDetails, activeTab, loadMessages, handleError]
//   )

//   // Auto-refresh messages
//   useEffect(() => {
//     if (activeTab === "chat" && selectedTeam) {
//       const interval = setInterval(() => {
//         loadMessages(selectedTeam.id, selectedTeam.members, true)
//       }, 30000)
//       return () => clearInterval(interval)
//     }
//   }, [activeTab, selectedTeam, loadMessages])

//   // Load teams on mount
//   useEffect(() => {
//     if (token) {
//       loadTeams()
//     }
//   }, [token, loadTeams])

//   // Helper functions
//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case "owner":
//         return <Crown className="h-4 w-4 text-yellow-400" />
//       case "admin":
//         return <Shield className="h-4 w-4 text-blue-400" />
//       default:
//         return <User className="h-4 w-4 text-gray-400" />
//     }
//   }

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case "owner":
//         return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
//       case "admin":
//         return "bg-blue-500/20 text-blue-300 border-blue-500/30"
//       default:
//         return "bg-gray-500/20 text-gray-300 border-gray-500/30"
//     }
//   }

//   const canInvite = selectedTeam && (selectedTeam.your_role === "owner" || selectedTeam.your_role === "admin")

//   if (!authUser || !token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
//       <div className="container mx-auto p-6">
//         {/* Header */}
//         <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-purple-100">Team Chat</h1>
//               <p className="text-purple-200/70 mt-1">Welcome back, {authUser.name}</p>
//             </div>
//             <div className="flex items-center gap-2">
//               {isOnline ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
//               <span className={`text-sm ${isOnline ? "text-green-400" : "text-red-400"}`}>
//                 {isOnline ? "Online" : "Offline"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Offline Alert */}
//         {!isOnline && (
//           <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20 text-yellow-300">
//             <WifiOff className="h-4 w-4" />
//             <AlertDescription>You're currently offline. Some features may not work properly.</AlertDescription>
//           </Alert>
//         )}

//         {/* Navigation Tabs */}
//         <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 p-2 mb-6">
//           <div className="flex gap-2">
//             <Button
//               variant={activeTab === "teams" ? "default" : "ghost"}
//               onClick={() => setActiveTab("teams")}
//               className={`flex-1 ${
//                 activeTab === "teams"
//                   ? "bg-purple-600 hover:bg-purple-700 text-white"
//                   : "text-purple-200 hover:bg-white/10 hover:text-white"
//               }`}
//             >
//               <Users className="h-4 w-4 mr-2" />
//               Teams
//             </Button>
//             <Button
//               variant={activeTab === "chat" ? "default" : "ghost"}
//               onClick={() => setActiveTab("chat")}
//               className={`flex-1 ${
//                 activeTab === "chat"
//                   ? "bg-purple-600 hover:bg-purple-700 text-white"
//                   : "text-purple-200 hover:bg-white/10 hover:text-white"
//               }`}
//               disabled={!selectedTeam}
//             >
//               <MessageCircle className="h-4 w-4 mr-2" />
//               Chat
//             </Button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Teams Panel */}
//           <div className="lg:col-span-1">
//             <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl shadow-purple-500/20 text-purple-100">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span>Your Teams</span>
//                   <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
//                     {teams.length}
//                   </Badge>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Create Team */}
//                 <div className="space-y-2">
//                   <Input
//                     placeholder="New team name..."
//                     value={newTeamName}
//                     onChange={(e) => setNewTeamName(e.target.value)}
//                     className="bg-white/5 border-white/20 text-purple-100 placeholder:text-purple-300/50"
//                     disabled={loading.createTeam || !isOnline}
//                   />
//                   <Button
//                     onClick={handleCreateTeam}
//                     className="w-full bg-purple-600 hover:bg-purple-700"
//                     disabled={loading.createTeam || !newTeamName.trim() || !isOnline}
//                   >
//                     {loading.createTeam ? (
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     ) : (
//                       <Plus className="h-4 w-4 mr-2" />
//                     )}
//                     Create Team
//                   </Button>
//                 </div>

//                 <Separator className="bg-white/20" />

//                 {/* Teams List */}
//                 <ScrollArea className="h-[400px]">
//                   {loading.teams ? (
//                     <div className="flex items-center justify-center py-8">
//                       <Loader2 className="h-6 w-6 animate-spin text-purple-300" />
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {teams.map((team) => (
//                         <div
//                           key={team.id}
//                           className={`p-4 rounded-lg border cursor-pointer transition-all ${
//                             selectedTeam?.id === team.id
//                               ? "bg-purple-500/20 border-purple-400/50"
//                               : "bg-white/5 border-white/10 hover:bg-white/10"
//                           } ${loading.teamDetails ? "opacity-50 pointer-events-none" : ""}`}
//                           onClick={() => !loading.teamDetails && handleTeamSelect(team)}
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <h3 className="font-semibold text-purple-100">{team.name}</h3>
//                             <div className="flex items-center gap-1">
//                               {getRoleIcon(team.role)}
//                               {loading.teamDetails && selectedTeam?.id === team.id && (
//                                 <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-between text-sm">
//                             <span className="text-purple-200/70">{team.member_count} members</span>
//                             <Badge className={getRoleBadgeColor(team.role)}>{team.role}</Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-2">
//             {activeTab === "teams" && selectedTeam ? (
//               <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl shadow-purple-500/20 text-purple-100">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5" />
//                     {selectedTeam.name}
//                     <Badge className={getRoleBadgeColor(selectedTeam.your_role)}>{selectedTeam.your_role}</Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {/* Team Members */}
//                   <div>
//                     <h3 className="text-lg font-semibold mb-4 text-purple-100">Team Members</h3>
//                     <div className="space-y-3">
//                       {selectedTeam.members.map((member) => (
//                         <div
//                           key={member.id}
//                           className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
//                         >
//                           <div className="flex items-center gap-3">
//                             <Avatar className="h-10 w-10">
//                               <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
//                               <AvatarFallback className="bg-purple-500/20 text-purple-300">
//                                 {member.name
//                                   .split(" ")
//                                   .map((n) => n[0])
//                                   .join("")}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="font-medium text-purple-100">{member.name}</p>
//                               <p className="text-sm text-purple-200/70">{member.email}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             {getRoleIcon(member.role)}
//                             <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Invite Member */}
//                   {canInvite && (
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4 text-purple-100">Invite Member</h3>
//                       <div className="space-y-2">
//                         <div className="flex gap-2">
//                           <Input
//                             placeholder="Enter email address..."
//                             value={inviteEmail}
//                             onChange={(e) => setInviteEmail(e.target.value)}
//                             className="bg-white/5 border-white/20 text-purple-100 placeholder:text-purple-300/50"
//                             disabled={loading.invite || !isOnline}
//                           />
//                           <select
//                             value={inviteRole}
//                             onChange={(e) => setInviteRole(e.target.value)}
//                             className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-purple-100"
//                             disabled={loading.invite || !isOnline}
//                           >
//                             <option value="member">Member</option>
//                             {selectedTeam.your_role === "owner" && <option value="admin">Admin</option>}
//                           </select>
//                         </div>
//                         <Button
//                           onClick={handleInviteUser}
//                           className="w-full bg-purple-600 hover:bg-purple-700"
//                           disabled={loading.invite || !inviteEmail.trim() || !isOnline}
//                         >
//                           {loading.invite ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
//                           Invite
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : activeTab === "chat" && selectedTeam ? (
//               <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl shadow-purple-500/20 text-purple-100 h-[600px] flex flex-col">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <MessageCircle className="h-5 w-5" />
//                     {selectedTeam.name} Chat
//                     {loading.messages && <Loader2 className="h-4 w-4 animate-spin" />}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-1 flex flex-col">
//                   {/* Messages */}
//                   <ScrollArea className="flex-1 mb-4">
//                     <div className="space-y-4">
//                       {messages.map((message) => (
//                         <div key={message.id} className="flex gap-3">
//                           <Avatar className="h-8 w-8">
//                             <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
//                               {message.senderName
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-1">
//                               <span className="font-medium text-purple-100 text-sm">{message.senderName}</span>
//                               <span className="text-xs text-purple-200/50">
//                                 {new Date(message.createdAt).toLocaleTimeString()}
//                               </span>
//                             </div>
//                             <p className="text-purple-200 bg-white/5 rounded-lg p-2 border border-white/10">
//                               {message.message}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </ScrollArea>

//                   {/* Message Input */}
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Type your message..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === "Enter" && !loading.sendMessage && handleSendMessage()}
//                       className="bg-white/5 border-white/20 text-purple-100 placeholder:text-purple-300/50"
//                       disabled={loading.sendMessage || !isOnline}
//                     />
//                     <Button
//                       onClick={handleSendMessage}
//                       className="bg-purple-600 hover:bg-purple-700"
//                       disabled={loading.sendMessage || !newMessage.trim() || !isOnline}
//                     >
//                       {loading.sendMessage ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Send className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl shadow-purple-500/20 text-purple-100">
//                 <CardContent className="flex items-center justify-center h-[400px]">
//                   <div className="text-center">
//                     <Users className="h-16 w-16 mx-auto mb-4 text-purple-300/50" />
//                     <h3 className="text-xl font-semibold mb-2">Select a Team</h3>
//                     <p className="text-purple-200/70">
//                       Choose a team from the sidebar to view details or start chatting
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Search, Settings, MessageSquare, Crown, UserPlus, ArrowLeft, Mail, Activity } from "lucide-react"
import { getTeams, createTeam, inviteTeamMember, getTeamInvitations } from "@/lib/api"

interface Team {
  id: string
  name: string
  description?: string
  member_count: number
  unread_messages: number
  role: "owner" | "admin" | "member"
  created_at: string
  last_activity: string
  members?: Array<{
    id: string
    name: string
    role: string
    online: boolean
  }>
}

interface TeamInvitation {
  id: string
  team_name: string
  inviter_name: string
  created_at: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadTeamsData()
  }, [router])

  const loadTeamsData = async () => {
    try {
      setIsLoading(true)
      const [teamsData, invitationsData] = await Promise.all([getTeams(), getTeamInvitations()])
      // Defensive: handle if API returns object instead of array
      let teamsArr = Array.isArray(teamsData) ? teamsData : (teamsData?.teams || []);
      let invitationsArr = Array.isArray(invitationsData) ? invitationsData : (invitationsData?.invitations || []);
      setTeams(teamsArr)
      setInvitations(invitationsArr)
    } catch (error) {
      console.error("Error loading teams:", error)
      setTeams([])
      setInvitations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return

    try {
      setIsLoading(true)
      // Expect createTeam to return { message, team }
      const newTeam = await createTeam({ name: newTeamName.trim() })
      console.log('createTeam response:', newTeam)
      setIsCreateModalOpen(false)
      setNewTeamName("")
      setSearchQuery("") // Clear search so new team is visible
      // Use newTeam.team for optimistic update
      if (newTeam && newTeam.team && newTeam.team.id) {
        const t = newTeam.team;
        setTeams((prev) => [
          {
            id: t.id,
            name: t.name,
            description: t.description || "",
            member_count: t.member_count || 1,
            unread_messages: 0,
            role: t.role || "owner",
            created_at: t.created_at || new Date().toISOString(),
            last_activity: t.last_activity || new Date().toISOString(),
            members: t.members || [],
          },
          ...prev,
        ])
      }
      // Do NOT call loadTeamsData() immediately; let the optimistic update show
      // Optionally, show a toast or alert for success here
    } catch (error) {
      alert("Error creating team. Check console for details.")
      console.error("Error creating team:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInviteMember = async () => {
    if (!selectedTeam || !inviteEmail.trim()) return

    try {
      await inviteTeamMember(selectedTeam.id, inviteEmail.trim())
      setIsInviteModalOpen(false)
      setInviteEmail("")
      setSelectedTeam(null)
      // Show success message
    } catch (error) {
      console.error("Error inviting member:", error)
    }
  }

  const filteredTeams = teams.filter(
    (team) => team && typeof team.name === 'string' && team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-600"
      case "admin":
        return "bg-blue-600"
      case "member":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3" />
      case "admin":
        return <Settings className="h-3 w-3" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 p-8">
          <div className="text-white text-xl text-center">Loading your teams...</div>
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
              <h1 className="text-3xl font-bold text-white">My Teams</h1>
              <p className="text-purple-100">Collaborate with your team members</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent className="backdrop-blur-md bg-slate-900/90 border border-white/20 text-white" aria-describedby="create-team-desc">
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <span id="create-team-desc" className="sr-only">Enter a name for your new team and click Create Team.</span>
                  <div>
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateTeam} className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Create Team
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
        </div>

        {/* Search Bar */}
        <Card className="mb-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-purple-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Invitations */}
        {invitations.length > 0 && (
          <Card className="mb-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="mr-2 h-5 w-5 text-purple-400" />
                Team Invitations ({invitations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <p className="text-white font-medium">{invitation.team_name}</p>
                      <p className="text-purple-300 text-sm">
                        Invited by {invitation.inviter_name} • {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No teams found</h3>
              <p className="text-purple-100 mb-6">Create your first team to start collaborating!</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{team.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRoleColor(team.role)} text-white text-xs flex items-center`}>
                          {getRoleIcon(team.role)}
                          <span className="ml-1">{team.role.toUpperCase()}</span>
                        </Badge>
                        <Badge className="bg-blue-600 text-white text-xs">{team.member_count} members</Badge>
                      </div>
                    </div>
                    {(team.role === "owner" || team.role === "admin") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-300 hover:text-white hover:bg-white/10"
                        onClick={() => {
                          setSelectedTeam(team)
                          setIsInviteModalOpen(true)
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {team.description && <p className="text-purple-100 text-sm mb-4">{team.description}</p>}

                  {/* Member Avatars */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex -space-x-2">
                      {team.members?.slice(0, 4).map((member, index) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-white/20">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.member_count > 4 && (
                        <div className="h-8 w-8 rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center">
                          <span className="text-white text-xs">+{team.member_count - 4}</span>
                        </div>
                      )}
                    </div>
                    {team.unread_messages > 0 && (
                      <Badge className="bg-red-500 text-white text-xs ml-auto">{team.unread_messages} new</Badge>
                    )}
                  </div>

                  {/* Team Actions */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-purple-300">
                      <Activity className="mr-1 h-4 w-4" />
                      <span>{new Date(team.last_activity).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/chat?team=${team.id}`}>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Invite Member Modal */}
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogContent className="backdrop-blur-md bg-slate-900/90 border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleInviteMember} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Send Invitation
                </Button>
                <Button
                  onClick={() => setIsInviteModalOpen(false)}
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
