import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "Using Task Delegation App has made managing my team stress-free. Tasks are completed on time, and the app’s features ensure nothing is ever missed.",
    name: "Komal Jain",
    title: "Chemical Manufacturing",
    image: '/people/female1.jpg',
  },
  {
    quote: "Zapllo has transformed the way we manage tasks. Everyone stays accountable, and the streamlined system has made performance reviews so much easier.",
    name: "Tarun Bhatia",
    title: "Real Estate",
    image: '/people/man1.jpg',
  },
  {
    quote: "Since adopting Zapllo, my team’s productivity has skyrocketed. The visual dashboard and notifications make staying on top of tasks effortless.",
    name: "Harsh Pandey",
    title: "Digital Marketing Agency",
    image: '/people/man2.jpg',
  },
  {
    quote: "Zapllo is an incredible tool for managing projects. Assigning tasks is effortless, and the voice commands save a ton of time. A must-have for any business.",
    name: "Suresh Shetty",
    title: "IT Services",
    image: '/people/man3.jpg',
  },
  {
    quote: "Task delegation has never been easier. With audio notes and detailed dashboards, I always know the progress of my team’s tasks. Zapllo is a fantastic tool!",
    name: "Kavita Menon",
    title: "Pharma Manufacturer",
    image: '/people/female2.jpg',
  },
  {
    quote: "Zapllo feels like mission control for our operations. Communication is seamless, and the automation features make it an essential tool for our team.",
    name: "Yash Goyal",
    title: "Garments Manufacturing",
    image: '/people/man4.jpg',
  },
  {
    quote: "The app has significantly improved accountability in my team. Tasks are executed on time, and I no longer need to follow up constantly. Highly recommended!",
    name: "Karan Oberoi",
    title: "Jewellery Manufacturer",
    image: '/people/man5.jpg',
  },
  {
    quote: "Zapllo has streamlined our workflow like never before. From task tracking to automation, it has made our operations smooth and efficient.",
    name: "Rohan Mehta",
    title: "Garments Manufacturing",
    image: '/people/man6.jpg',
  },
];

export default function ModernTestimonials() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
        <p className="text-muted-foreground mt-2">Join thousands of satisfied users transforming their businesses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Avatar>
                <AvatarImage src={testimonial.image} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground">"{testimonial.quote}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
