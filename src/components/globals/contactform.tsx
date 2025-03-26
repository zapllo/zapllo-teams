'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle, Loader2, ArrowRight, Mail, Sparkles } from 'lucide-react'
import { AlertDialog as Alert, AlertDialogDescription as AlertDescription } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'

// Form schema that matches the API requirements
const formSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    mobNo: z.string().min(5, { message: 'Please enter a valid phone number.' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
    subscribedStatus: z.enum([
        "Yes, I need Support",
        "No, I need a callback for my queries and then subscribe"
    ], {
        required_error: "Please select an option",
    }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions.',
    }),
})

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            mobNo: '',
            message: '',
            subscribedStatus: undefined,
            agreeToTerms: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError("")

        try {
            // Format the payload to match the API expectations
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                mobNo: values.mobNo,
                message: values.message,
                subscribedStatus: values.subscribedStatus // Now sending the exact enum value expected by the API
            }

            console.log("Sending payload to /api/leads:", payload)

            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (response.ok) {
                // Success message
                // alert("Message sent successfully!")
                setIsSuccess(true)
                form.reset()
            } else {
                setError(data.error || "Something went wrong. Please try again.")
            }
        } catch (err) {
            console.error("API call error:", err)
            setError("Network error. Please check your connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        form.reset()
        setIsSuccess(false)
        setError("")
    }

    return (
        <div className="w-full relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative bg-slate-900/40 backdrop-blur-sm p-5 md:p-8 border border-slate-800 rounded-xl">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="mb-6">
                                <Badge variant="outline" className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 text-white border-0 mb-3">
                                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Priority Response
                                </Badge>
                                <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                                    Let&apos;s Start Your Automation Journey
                                </h3>
                                <p className="text-slate-400 text-sm mt-1.5">
                                    Fill out the form below and our team will reach out within 24 hours
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-200">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="John"
                                                            {...field}
                                                            className="bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-200">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Doe"
                                                            {...field}
                                                            className="bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="you@company.com"
                                                        type="email"
                                                        {...field}
                                                        className="bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="mobNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+1 (555) 123-4567"
                                                        {...field}
                                                        className="bg-slate-900/50 border-slate-700 focus-visible:ring-purple-500/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200">Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about your business needs and automation goals..."
                                                        className="bg-slate-900/50 border-slate-700 min-h-[100px] focus-visible:ring-purple-500/50"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* New subscription status field with radio buttons */}
                                    <FormField
                                        control={form.control}
                                        name="subscribedStatus"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-slate-200">Have you already subscribed for the Apps? *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-800 p-4 bg-slate-900/30">
                                                            <FormControl>
                                                                <RadioGroupItem value="Yes, I need Support" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">
                                                                Yes, I need Support
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-slate-800 p-4 bg-slate-900/30">
                                                            <FormControl>
                                                                <RadioGroupItem value="No, I need a callback for my queries and then subscribe" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">
                                                                No, I need a callback for my queries and then subscribe
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="agreeToTerms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#815BF5] data-[state=checked]:to-[#FC8929] data-[state=checked]:border-slate-700"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-normal">
                                                        I agree to the <a href="#" className="text-[#815BF5] hover:underline">Terms of Service</a> and <a href="#" className="text-[#815BF5] hover:underline">Privacy Policy</a>
                                                    </FormLabel>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && (
                                        <Alert >
                                            <div className='flex items-center gap-1'>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    {error}
                                                </AlertDescription>
                                            </div>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 transition-all py-6"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center pt-2">
                                        <p className="text-xs text-slate-500">
                                            Join 20,000+ businesses who&apos;ve already transformed their workflows
                                        </p>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                Message Received!
                            </h3>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Thank you for reaching out to Zapllo. We&apos;ve sent a confirmation to your email and one of our automation experts will get back to you within 24 hours.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                    className="border-slate-700 hover:bg-slate-800"
                                >
                                    Send Another Message
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Check Our Documentation
                                </Button>
                            </div>

                            <div className="mt-8 p-4 border border-slate-800 rounded-lg bg-gradient-to-r from-slate-900/70 to-slate-900/30">
                                <p className="text-sm text-slate-300">
                                    <span className="block font-semibold mb-1">🚀 Fast-Track Your Automation</span>
                                    Explore our <a href="#" className="text-[#FC8929] hover:underline">case studies</a> to see how Zapllo has transformed businesses like yours.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    )
}