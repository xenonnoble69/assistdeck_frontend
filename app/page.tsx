"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Bot,
  Users,
  Calendar,
  BarChart3,
  Bell,
  GraduationCap,
  Briefcase,
  Star,
  Check,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Smart progress monitoring with AI-powered insights",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "24/7 productivity help and intelligent recommendations",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time messaging and seamless teamwork",
    },
    {
      icon: Calendar,
      title: "Calendar Integration",
      description: "Never miss deadlines with smart scheduling",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your progress with detailed insights",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated with intelligent alerts",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graduate Student",
      content: "Helped me organize my thesis project perfectly. The AI assistant saved me countless hours!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      content: "My team productivity increased by 40%. AssistDeck is a game-changer for entrepreneurs.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Project Manager",
      content: "Best investment for project management. The analytics dashboard provides incredible insights.",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "What makes AssistDeck different from other productivity tools?",
      answer:
        "AssistDeck combines AI-powered assistance with goal tracking and team collaboration in one seamless platform, specifically designed for students and entrepreneurs.",
    },
    {
      question: "Can I switch between Student and Entrepreneur plans?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for both plans so you can experience all features before committing.",
    },
    {
      question: "How does the AI assistant work?",
      answer:
        "Our AI assistant learns from your work patterns and provides personalized recommendations, helps with task prioritization, and offers productivity insights.",
    },
    {
      question: "Can I use AssistDeck offline?",
      answer:
        "While some features require internet connectivity, you can access your goals, notes, and basic features offline with automatic sync when reconnected.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer 24/7 email support for all users, with priority support and live chat available for Entrepreneur plan subscribers.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                AssistDeck🧱
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-purple-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-purple-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-purple-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  className="text-purple-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-purple-100 hover:text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-purple-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-md bg-white/10 border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="text-purple-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-purple-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-purple-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-purple-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                FAQ
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="w-full text-purple-100 hover:text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI-powered platform for{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              students and entrepreneurs
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Boost productivity with smart goal tracking, team collaboration, and AI assistance. Transform the way you
            work and achieve your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg backdrop-blur-md bg-transparent"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Maximum Productivity
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Everything you need to stay organized, collaborate effectively, and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-purple-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-purple-100">Join thousands of satisfied students and entrepreneurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20"
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-purple-100 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-purple-300 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-purple-100">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Student Plan */}
            <Card className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20 relative">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Student</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$53</span>
                  <span className="text-purple-100">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Personal goals tracking
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    AI chat assistance
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Basic analytics
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Calendar integration
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Entrepreneur Plan */}
            <Card className="backdrop-blur-md bg-white/10 border border-purple-400/50 rounded-2xl shadow-xl shadow-purple-500/30 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                Recommended
              </Badge>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Briefcase className="h-8 w-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Entrepreneur</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$170</span>
                  <span className="text-purple-100">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Everything in Student
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Team collaboration
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center text-purple-100">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-purple-100">Everything you need to know about AssistDeck</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-purple-500/20"
              >
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors rounded-2xl"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-purple-400 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-purple-100">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900/50 backdrop-blur-md border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                AssistDeck🧱
              </h3>
              <p className="text-purple-100 mb-4">
                AI-powered productivity platform for students and entrepreneurs. Transform the way you work and achieve
                your dreams.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-purple-100 hover:text-white hover:bg-white/10">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-purple-100 hover:text-white hover:bg-white/10">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-purple-100 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-purple-100 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-purple-100 hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-purple-100">© 2024 AssistDeck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
