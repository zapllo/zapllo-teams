'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from '@/lib/utils'
import { motion } from "framer-motion"

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  image?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, position, image }) => {
  return (
    <Card className="bg-background border-none shadow">
      <CardContent className="p-6">
        <div className="mb-4 text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.13 17.5H2.5V12.9C2.5 10.5 3.19 8.57 4.56 7.09C5.94 5.6 7.97 4.46 10.66 3.67L12.5 6.5C10.94 7.11 9.75 7.85 8.94 8.71C8.13 9.58 7.62 10.59 7.44 11.73H9.13V17.5ZM20.13 17.5H13.5V12.9C13.5 10.5 14.19 8.57 15.56 7.09C16.94 5.6 18.97 4.46 21.66 3.67L23.5 6.5C21.94 7.11 20.75 7.85 19.94 8.71C19.13 9.58 18.62 10.59 18.44 11.73H20.13V17.5Z" fill="currentColor"/>
          </svg>
        </div>
        <p className="text-foreground mb-6 italic">{quote}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            {image && <AvatarImage src={image} alt={author} />}
            <AvatarFallback>{author.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{author}</h4>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientTestimonials() {
  const testimonials = [
    {
      quote: "Zapllo has transformed how we operate. Task management is streamlined, attendance tracking is automated, and our team productivity has never been better.",
      author: "Rahul Gupta",
      position: "CEO, TechInnovate Solutions",
    },
    {
      quote: "The WhatsApp integration is a game-changer. Our team gets instant notifications, and we've reduced miscommunication by over 80%.",
      author: "Priya Sharma",
      position: "Operations Manager, GrowFast Retail",
    },
    {
      quote: "I was spending hours each month on payroll processing. With Zapllo, it's now automated and takes just minutes. The ROI has been incredible.",
      author: "Vikram Nair",
      position: "Founder, Innovate Digital",
    },
    {
      quote: "As someone running a small business, having all my tools in one platform saves me time and money. Zapllo is worth every rupee.",
      author: "Neha Kapoor",
      position: "Director, Style Hub Boutique",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Testimonial {...testimonial} />
        </motion.div>
      ))}
    </div>
  )
}