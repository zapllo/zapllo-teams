'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users } from 'lucide-react'

import TeamTabs from '@/components/globals/tabstabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'

export default function Teams() {
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>()

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('/api/organization/getById')
        const organization = response.data.data

        // Check if the trial has expired
        const isExpired = organization.trialExpires &&
          new Date(organization.trialExpires) <= new Date()

        setIsTrialExpired(isExpired)

        // Get current user
        const userResponse = await axios.get('/api/users/me')
        setCurrentUser(userResponse.data.data)
      } catch (error) {
        console.error('Error fetching organization details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserDetails()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-64" />
        <div className="mt-6">
          <Skeleton className="h-10 w-full max-w-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // if (isTrialExpired) {
  //   return (
  //     <div className="flex items-center justify-center p-8 h-[calc(100vh-200px)]">
  //       <Alert variant="destructive" className="max-w-xl border-red-300 bg-red-50 dark:bg-red-900/20">
  //         <AlertTitle className="text-xl font-bold mb-2 flex items-center gap-2">
  //           <span className="text-red-500">Your trial has expired</span>
  //         </AlertTitle>
  //         <AlertDescription className="text-base">
  //           <p className="mb-4">Please purchase a subscription to continue using the Team Management features.</p>
  //           <Link href="/dashboard/billing">
  //             <Button size="lg" variant="default" className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
  //               👑 Upgrade to Pro
  //             </Button>
  //           </Link>
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   )
  // }

  return (
    <div className="p-6 mt-12 overflow-hidden max-w-7xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Team Management
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Organize and manage your team members
              </CardDescription>
            </div>
          </div>
        </CardHeader>

      </Card>
      <TeamTabs />
    </div>
  )
}
