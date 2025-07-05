"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, GraduationCap, Briefcase, Check } from "lucide-react"
import { registerUser, loginUser, updateUserRole } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  selectedRole: "student" | "entrepreneur" | ""
  agreeToTerms: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  selectedRole?: string
  agreeToTerms?: string
  api?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedRole: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Role validation
    if (!formData.selectedRole) {
      newErrors.selectedRole = "Please select a plan"
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Step 1: Register user
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        selectedRole: formData.selectedRole,
      })

      // Step 2: Login to get token
      const loginData = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })

      const token = loginData.token

      // Step 3: Update user role
      await updateUserRole(formData.selectedRole)

      // Success - store token and redirect
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(loginData.user))

      setIsSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({
        api: error instanceof Error ? error.message : "Registration failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-purple-100 mb-4">Welcome to AssistDeck! Redirecting you to your dashboard...</p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20">
        <CardHeader className="text-center pb-6">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              AssistDeck🧱
            </h1>
          </Link>
          <CardTitle className="text-2xl text-white">Create Your Account</CardTitle>
          <p className="text-purple-100">Join thousands of productive students and entrepreneurs</p>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          {errors.api && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-200">{errors.api}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-100">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-100">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-100">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400 pr-10"
                      placeholder="Create a password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-purple-300 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-purple-100">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400 pr-10"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-purple-300 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Role Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Choose Your Plan</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Plan */}
                <div
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    formData.selectedRole === "student"
                      ? "border-purple-400 bg-purple-500/20"
                      : "border-white/20 bg-white/5 hover:border-purple-400/50"
                  }`}
                  onClick={() => handleInputChange("selectedRole", "student")}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <GraduationCap className="h-6 w-6 text-purple-400 mr-2" />
                      <h4 className="text-lg font-semibold text-white">Student</h4>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.selectedRole === "student" ? "border-purple-400 bg-purple-400" : "border-white/40"
                      }`}
                    >
                      {formData.selectedRole === "student" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">
                    $53<span className="text-sm text-purple-100">/month</span>
                  </p>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Personal goals tracking</li>
                    <li>• AI chat assistance</li>
                    <li>• Basic analytics</li>
                  </ul>
                </div>

                {/* Entrepreneur Plan */}
                <div
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    formData.selectedRole === "entrepreneur"
                      ? "border-purple-400 bg-purple-500/20"
                      : "border-white/20 bg-white/5 hover:border-purple-400/50"
                  }`}
                  onClick={() => handleInputChange("selectedRole", "entrepreneur")}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-6 w-6 text-purple-400 mr-2" />
                      <h4 className="text-lg font-semibold text-white">Entrepreneur</h4>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.selectedRole === "entrepreneur" ? "border-purple-400 bg-purple-400" : "border-white/40"
                      }`}
                    >
                      {formData.selectedRole === "entrepreneur" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">
                    $170<span className="text-sm text-purple-100">/month</span>
                  </p>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Everything + Team features</li>
                    <li>• Advanced analytics</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
              {errors.selectedRole && <p className="text-red-400 text-sm">{errors.selectedRole}</p>}
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-purple-100">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-purple-100">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
