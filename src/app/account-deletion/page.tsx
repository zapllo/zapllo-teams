'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertDialog as Alert, AlertDialogDescription as AlertDescription, AlertDialogTitle as AlertTitle } from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, CheckCircle2, Clock, Info, Trash2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { FloatingNavbar } from '@/components/globals/navbar'
import Footer from '@/components/globals/Footer'
import { toast } from 'sonner'

export default function AccountDeletionPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!confirmDelete) {
      toast.error("Please confirm that you understand the consequences of account deletion")
    }

    setLoading(true)

    try {
      const response = await fetch('/api/users/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
        toast.success( "Account deletion initiated")
      } else {
        toast.error( data.error || "Failed to process your request")
      }
    } catch (error) {
      toast( "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#05071E] min-h-screen">
      <FloatingNavbar />
      {/* <Image
        src='/mask.png'
        height={1000}
        className="absolute overflow-hidden w-full"
        width={1000}
        alt="Background mask for zapllo automation"
      /> */}

      <div className="container max-w-3xl mt-12 py-24 px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-8">
          {/* <Link href="/" className="inline-block mb-8">
            <img
              src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png"
              alt="Zapllo Logo"
              className="mx-auto h-12"
            />
          </Link> */}

          <Badge variant="outline" className="px-4 py-2 mb-4 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm">
            <Clock className="h-4 w-4 mr-2 text-purple-400" />
            <span className="text-xs">Account Management</span>
          </Badge>

          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">
            Account Deletion Request
          </h1>

          <p className="text-[#676B93] max-w-md mx-auto text-sm">
            We&apos;re sorry to see you go. Please review the information below before proceeding.
          </p>
        </div>

        {step === 1 ? (
          <>
            <Alert >
              <div className='flex gap-1 items-center'>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Important Information</AlertTitle>
              </div>
              <AlertDescription className="text-[#676B93]">
                Account deletion is permanent and cannot be undone. All your data will be permanently removed.
              </AlertDescription>
            </Alert>

            <Card className="mb-8 bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 backdrop-blur-sm shadow-[0_0_20px_rgba(129,91,245,0.1)]">
              <CardHeader>
                <CardTitle className="text-xl">What happens when you delete your account?</CardTitle>
                <CardDescription className="text-[#676B93]">
                  Please review this information carefully before proceeding with deletion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex gap-4">
                  <Trash2 className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Data that will be permanently deleted:</h3>
                    <ul className="list-disc pl-5 pt-1 text-sm text-[#676B93]">
                      <li>Your profile information (name, email, contact details)</li>
                      <li>Your leave history and balances</li>
                      <li>Your attendance records</li>
                      <li>Your task history</li>
                      <li>Your face recognition data</li>
                      <li>Your bank and legal document information</li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-[#676B93]/20" />

                <div className="flex gap-4">
                  <Info className="h-6 w-6 text-[#815BF5] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Anonymized data we may retain:</h3>
                    <p className="text-sm text-[#676B93] pt-1">
                      Some anonymized usage statistics may be retained for analytical purposes, but these cannot be traced back to your identity.
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#676B93]/20" />

                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-[#FC8929] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Deletion timeline:</h3>
                    <p className="text-sm text-[#676B93] pt-1">
                      Your account deletion request will be processed within 14 days. During this period, your account will be deactivated but not permanently deleted, giving you time to change your mind.
                    </p>
                  </div>
                </div>

                <Separator className="bg-[#676B93]/20" />

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white">Organization data:</h3>
                    <p className="text-sm text-[#676B93] pt-1">
                      If you are an organization admin, you must transfer ownership or delete your organization before deleting your account.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
              <Card className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 backdrop-blur-sm shadow-[0_0_20px_rgba(129,91,245,0.1)]">
                <CardHeader>
                  <CardTitle className="text-xl">Request Account Deletion</CardTitle>
                  <CardDescription className="text-[#676B93]">
                    Please verify your identity to proceed with account deletion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#E4E4E7]">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#0A0D28] border-[#815bf5]/20 focus:border-[#815bf5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#E4E4E7]">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#0A0D28] border-[#815bf5]/20 focus:border-[#815bf5]"
                    />
                  </div>
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="confirmDelete"
                      checked={confirmDelete}
                      onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
                      className="border-[#815bf5]/50 data-[state=checked]:bg-[#815BF5] data-[state=checked]:border-[#815BF5]"
                    />
                    <Label
                      htmlFor="confirmDelete"
                      className="text-sm font-normal leading-none text-[#E4E4E7] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand that deleting my account is permanent and cannot be undone. All my data will be permanently deleted as described above.
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto border-[#815bf5]/20 text-[#E4E4E7] hover:bg-[#815bf5]/10 hover:text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white hover:opacity-90"
                  >
                    {loading ? "Processing..." : "Delete My Account"}
                  </Button>
                </CardFooter>
              </Card>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#676B93] text-sm">
                Need assistance? <a href="mailto:support@zapllo.com" className="text-[#815BF5] hover:underline">Contact our support team</a>
              </p>
            </div>
          </>
        ) : (
          <Card className="text-center bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 backdrop-blur-sm shadow-[0_0_20px_rgba(129,91,245,0.1)]">
            <CardHeader>
              <CardTitle className="text-xl">Deletion Request Submitted</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20">
                  <CheckCircle2 className="h-12 w-12 text-[#815BF5]" />
                </div>
              </div>
              <div>
                <p className="mb-4 text-[#E4E4E7]">
                  Your account deletion request has been received. Your account is now deactivated.
                </p>
                <p className="text-[#676B93]">
                  All your data will be permanently deleted within 14 days. If you change your mind,
                  please contact our support team immediately.
                </p>
              </div>

              <div className="bg-[#0A0D28]/60 border border-[#815bf5]/10 rounded-lg p-4 text-left">
                <h3 className="font-medium text-[#E4E4E7] mb-2">What happens next?</h3>
                <ul className="text-sm text-[#676B93] space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">1</span>
                    <span>Your account is now in a deactivated state for 14 days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">2</span>
                    <span>You&apos;ll receive a confirmation email with details about the deletion process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">3</span>
                    <span>After 14 days, all your data will be permanently removed from our systems</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white hover:opacity-90"
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Add Zapllo value proposition at the bottom */}
        {step === 1 && (
          <div className="mt-12 py-6 border-t border-[#676B93]/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-[#815BF5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-white mb-1">30+ Hours Saved</h3>
                <p className="text-xs text-[#676B93]">Per week with Zapllo automation</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-[#815BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-white mb-1">Data Security</h3>
                <p className="text-xs text-[#676B93]">Enterprise-grade encryption & compliance</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-[#815BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-white mb-1">20,000+ Businesses</h3>
                <p className="text-xs text-[#676B93]">Trust Zapllo with their operations</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#676B93] mb-3">
                We&apos;re on a mission to help 10 Million MSMEs automate their business operations
              </p>
              <Link href="/contact" className="text-sm text-[#815BF5] hover:underline">
                Have feedback? We&apos;d love to hear from you
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Public page info for Google Play Compliance */}
      <div className="bg-gradient-to-br from-[#0a0d28]/90 to-[#0a0d28] backdrop-blur-sm py-12 relative z-10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Account Deletion Policy</h2>
            <p className="text-[#676B93] text-sm max-w-2xl mx-auto">
              At Zapllo, we respect your right to data privacy and control over your personal information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#1a1e48]/30 border border-[#815bf5]/10 rounded-xl p-5">
              <h3 className="font-medium mb-3 flex items-center text-[#E4E4E7]">
                <Trash2 className="h-5 w-5 mr-2 text-[#FC8929]" />
                Data Deletion Process
              </h3>
              <ul className="space-y-2 text-sm text-[#676B93]">
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">1</span>
                  <span>Account deactivation immediately upon request</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">2</span>
                  <span>14-day grace period before permanent deletion</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">3</span>
                  <span>Complete removal of all personal data after grace period</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">4</span>
                  <span>Confirmation email sent when deletion is complete</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1e48]/30 border border-[#815bf5]/10 rounded-xl p-5">
              <h3 className="font-medium mb-3 flex items-center text-[#E4E4E7]">
                <Info className="h-5 w-5 mr-2 text-[#815BF5]" />
                How to Delete Your Account
              </h3>
              <ul className="space-y-2 text-sm text-[#676B93]">
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">A</span>
                  <span><strong>In-App:</strong> Go to Profile → Settings → Account → Delete Account</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">B</span>
                  <span><strong>Website:</strong> Log in to zapllo.com → Account Settings → Delete Account</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">C</span>
                  <span><strong>Email:</strong> Contact support@zapllo.com with subject &quot;Account Deletion Request&quot;</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#676B93] text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex bg-[#04061E] justify-center">
        <Footer />
      </div>
    </main>
  )
}
