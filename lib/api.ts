// API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

export const apiEndpoints = {
  // Authentication
  register: `${API_BASE_URL}/api/register`,
  login: `${API_BASE_URL}/api/login`,
  profile: `${API_BASE_URL}/api/users/profile`,
  updateRole: `${API_BASE_URL}/api/users/role`,

  // Dashboard
  dashboard: `${API_BASE_URL}/api/dashboard`,

  // Goals
  goals: `${API_BASE_URL}/api/goals`,
  goalById: (id: string) => `${API_BASE_URL}/api/goals/${id}`,
  goalProgress: (id: string) => `${API_BASE_URL}/api/goals/${id}/progress`,
  subgoals: (id: string) => `${API_BASE_URL}/api/goals/${id}/subgoals`,

  // Calendar
  calendar: `${API_BASE_URL}/api/calendar`,
  calendarById: (id: string) => `${API_BASE_URL}/api/calendar/${id}`,

  // Teams
  teams: `${API_BASE_URL}/api/teams`,
  teamById: (id: string) => `${API_BASE_URL}/api/teams/${id}`,
  teamInvite: (id: string) => `${API_BASE_URL}/api/teams/${id}/invite`,
  teamInvitations: `${API_BASE_URL}/api/invitations`,
  acceptInvite: (token: string) => `${API_BASE_URL}/api/teams/invite/${token}/accept`,

  // Chat
  chat: `${API_BASE_URL}/api/chat`,
  chatByTeam: (teamId: string) => `${API_BASE_URL}/api/chat/${teamId}`,

  // Notifications
  notifications: `${API_BASE_URL}/api/notifications`,
  markNotificationRead: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,

  // Payments
  paypalCreate: `${API_BASE_URL}/api/paypal/create`,
  paypalWebhook: `${API_BASE_URL}/api/paypal/webhook`,
}

// API helper functions
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token")

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  let responseBody: any = null;
  let responseText: string = '';
  try {
    responseText = await response.text();
    try {
      responseBody = JSON.parse(responseText);
    } catch (e) {
      responseBody = responseText;
    }
  } catch (e) {
    responseBody = null;
  }

  if (!response.ok) {
    let errorText = '';
    if (responseBody && typeof responseBody === 'object' && responseBody.error) {
      errorText = responseBody.error;
    } else if (typeof responseBody === 'string') {
      errorText = responseBody;
    } else {
      errorText = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorText);
  }

  return responseBody;
}

// Dashboard API
export const getDashboard = async () => {
  return apiCall(apiEndpoints.dashboard, { method: "GET" })
}

// Goals API
export const getGoals = async () => {
  return apiCall(apiEndpoints.goals, { method: "GET" })
}

export const createGoal = async (goalData: {
  title: string
  description: string
  priority: string
  deadline: string
}) => {
  return apiCall(apiEndpoints.goals, {
    method: "POST",
    body: JSON.stringify(goalData),
  })
}

export const updateGoal = async (id: string, goalData: any) => {
  return apiCall(apiEndpoints.goalById(id), {
    method: "PUT",
    body: JSON.stringify(goalData),
  })
}

export const deleteGoal = async (id: string) => {
  return apiCall(apiEndpoints.goalById(id), { method: "DELETE" })
}

export const updateGoalProgress = async (id: string, progress: number) => {
  return apiCall(apiEndpoints.goalProgress(id), {
    method: "PATCH",
    body: JSON.stringify({ progress }),
  })
}

export const addSubgoal = async (
  id: string,
  subgoalData: {
    title: string
    completed: boolean
  },
) => {
  return apiCall(apiEndpoints.subgoals(id), {
    method: "POST",
    body: JSON.stringify(subgoalData),
  })
}

// Calendar API
export const getCalendarEvents = async () => {
  return apiCall(apiEndpoints.calendar, { method: "GET" })
}

export const createCalendarEvent = async (eventData: {
  title: string
  description: string
  start_time: string
  end_time: string
  all_day: boolean
  color: string
}) => {
  return apiCall(apiEndpoints.calendar, {
    method: "POST",
    body: JSON.stringify(eventData),
  })
}

export const updateCalendarEvent = async (id: string, eventData: any) => {
  return apiCall(apiEndpoints.calendarById(id), {
    method: "PUT",
    body: JSON.stringify(eventData),
  })
}

export const deleteCalendarEvent = async (id: string) => {
  return apiCall(apiEndpoints.calendarById(id), { method: "DELETE" })
}

// Teams API
export const getTeams = async () => {
  return apiCall(apiEndpoints.teams, { method: "GET" })
}

export const createTeam = async (teamData: { name: string }) => {
  return apiCall(apiEndpoints.teams, {
    method: "POST",
    body: JSON.stringify(teamData),
  })
}

export const getTeamById = async (id: string) => {
  return apiCall(apiEndpoints.teamById(id), { method: "GET" })
}

export const inviteTeamMember = async (teamId: string, email: string) => {
  return apiCall(apiEndpoints.teamInvite(teamId), {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export const getTeamInvitations = async () => {
  return apiCall(apiEndpoints.teamInvitations, { method: "GET" })
}

export const acceptTeamInvite = async (token: string) => {
  return apiCall(apiEndpoints.acceptInvite(token), { method: "POST" })
}

// Chat API
export const sendMessage = async (messageData: {
  message: string
  sender_id: string
  team_id: string
}) => {
  return apiCall(apiEndpoints.chat, {
    method: "POST",
    body: JSON.stringify(messageData),
  })
}

export const getTeamMessages = async (teamId: string) => {
  return apiCall(apiEndpoints.chatByTeam(teamId), { method: "GET" })
}

// Notifications API
export const getNotifications = async () => {
  return apiCall(apiEndpoints.notifications, { method: "GET" })
}

export const markNotificationAsRead = async (id: string) => {
  return apiCall(apiEndpoints.markNotificationRead(id), { method: "PATCH" })
}

// Payments API
export const createPayPalPayment = async (plan: string) => {
  return apiCall(apiEndpoints.paypalCreate, {
    method: "POST",
    body: JSON.stringify({ plan }),
  })
}

// Specific API functions (keeping existing ones)
export const registerUser = async (userData: {
  name: string
  email: string
  password: string
  subscription?: string
  selectedRole?: string
}) => {
  const subscriptionValue = (userData.subscription || userData.selectedRole || '').toLowerCase();

  console.log("📦 Register Payload:", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    subscription: subscriptionValue
  });

  return apiCall(apiEndpoints.register, {
    method: "POST",
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      subscription: subscriptionValue, // ✅ correct key for backend
    }),
  });
}




export const loginUser = async (credentials: {
  email: string
  password: string
}) => {
  return apiCall(apiEndpoints.login, {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export const updateUserRole = async (role: string) => {
  return apiCall(apiEndpoints.updateRole, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
}

export const getUserProfile = async () => {
  return apiCall(apiEndpoints.profile, {
    method: "GET",
  })
}
