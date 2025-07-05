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
