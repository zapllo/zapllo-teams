"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Loader from "@/components/ui/loader"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post("/api/forgetPassword", { email })
      setLoading(false)
      toast(
        <div className=" w-full mb-6 gap-2 m-auto">
          <div className="w-full flex justify-center">
            <DotLottieReact src="/lottie/tick.lottie" loop autoplay />
          </div>
          <h1 className="text-black text-center font-medium text-lg">
            Password reset email sent successfully
          </h1>
        </div>
      )
      // Clear input
      setEmail("")
    } catch (error: any) {
      setLoading(false)
      if (
        error.response?.status === 404 &&
        error.response?.data?.error === "User not found"
      ) {
        toast(
          <div className=" w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
              <DotLottieReact src="/lottie/error.lottie" loop autoplay />
            </div>
            <h1 className="text-black text-center font-medium text-lg">
              User with this email not found
            </h1>
          </div>
        )
      } else {
        toast.error(error.response?.data?.error || "An error occurred")
      }
    }
  }

  return (
    <div className="bg-[#04061e] h-screen">
      <div className="flex w-full justify-center">
        <img src="/logo.png" className="h-6 mt-12" />
      </div>
      <div className="w-full flex justify-center">
        <Card className="p-5 mt-12 h-fit max-w-3xl w-1/2 rounded bg-transparent shadow-sm">
          <CardTitle className="font-medium text-md">Forgot Password</CardTitle>
          <CardDescription className="mt-2">
            Enter your registered Email to receive a password reset email
          </CardDescription>
          <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                className="w-full text-xs rounded outline-none bg-transparent border mt-2 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              className="bg-[#017a5b] text-xs hover:bg-[#017a5b]"
              type="submit"
            >
              {loading ? <Loader /> : "Send Password Link"}
            </Button>
          </form>
        </Card>
      </div>
      <div className="flex mt-12 justify-center gap-2">
        <Home />
        <Link href="/login">
          <h1 className="hover:underline cursor-pointer">Back to Login</h1>
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
