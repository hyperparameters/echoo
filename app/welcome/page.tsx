"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("echooUser")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.fullName)
    }
  }, [])

  const handleStartExploring = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Welcome Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Echoo, {userName}!</h1>
          <p className="text-lg text-muted-foreground">You're all set to start your influence journey</p>
        </div>

        {/* Next Steps Card */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">What's next?</h2>
            <ul className="space-y-3 text-left">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-muted-foreground">Upload and organize your content</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-muted-foreground">Get AI insights on your posts</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span className="text-muted-foreground">Discover events near you</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <Button
          onClick={handleStartExploring}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 h-auto"
        >
          Start Exploring
        </Button>
      </div>
    </div>
  )
}
