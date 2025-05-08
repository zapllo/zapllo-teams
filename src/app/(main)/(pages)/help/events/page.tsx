'use client';

import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UsersIcon, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '@/components/ui/tabs3';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  capacity: number;
  registrations: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      profilePic?: string;
    };
    registeredAt: string;
  }[];
}

export default function Events() {
  const [events, setEvents] = useState<{ upcoming: Event[], past: Event[] }>({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const upcomingRes = await axios.get('/api/events?filter=upcoming');
        const pastRes = await axios.get('/api/events?filter=past');

        setEvents({
          upcoming: upcomingRes.data.data,
          past: pastRes.data.data
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  function EventCard({ event }: { event: Event }) {
    return (
      <div className="overflow-hidden border pb-4  rounded-lg shadow-lg transition-all hover:shadow-xl hover:translate-y-[-4px] dark:bg-transparent bg-white">
        <div className="h-48 relative">
          <img
            src={event.coverImage}
            alt={event.title}
            className="object-fill"
          />
        </div>
        <div className="px-5">
          <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 dark:text-gray-200 line-clamp-2 mb-4">{event.description}</p>

          <div className="flex items-center gap-2  dark:text-gray-200 text-gray-500 mb-2">
            <CalendarIcon size={16} />
            <span>{format(new Date(event.startDate), 'PPP')}</span>
          </div>

          <div className="flex items-center gap-2 dark:text-gray-200 text-gray-500 mb-2">
            <Clock size={16} />
            <span>{format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}</span>
          </div>

          <div className="flex items-center gap-2 dark:text-gray-200 text-gray-500 mb-4">
            <MapPinIcon size={16} />
            <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <UsersIcon size={16} className="text-blue-500" />
              <span className="text-sm">{event.registrations.length} / {event.capacity} registered</span>
            </div>
            <Link href={`/help/events/${event._id}`}>
              <Button variant="default" size="sm" className="flex items-center gap-1">
                View Details <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



// Replace the loading return statement
if (loading) {
  return (
    <div className="flex h-full max-h-screen overflow-y-scroll pt-24">
      <div className="flex-1 p-4 mt-24">
        <div className="w-full min-h-screen -mt-32 mx-auto">
          {/* Page header skeleton */}
          <div className="mb-10">
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Tabs skeleton */}
          <div className="mb-6">
            <div className="inline-flex h-10 items-center justify-center rounded-lg p-1 bg-muted">
              <Skeleton className="h-8 w-36 mx-1 rounded-md" />
              <Skeleton className="h-8 w-36 mx-1 rounded-md" />
            </div>
          </div>

          {/* Event cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden border rounded-lg shadow-lg bg-white dark:bg-transparent pb-4">
                {/* Event image skeleton */}
                <div className="h-48">
                  <Skeleton className="h-full w-full" />
                </div>

                {/* Event content skeleton */}
                <div className="px-5">
                  <Skeleton className="h-7 w-4/5 mt-4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />

                  {/* Event details skeleton */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>

                  {/* Event footer skeleton */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="flex h-full max-h-screen overflow-y-scroll  pt-24">
      <div className="flex-1 p-4  mt-24">
        <div className="w-full min-h-screen -mt-32  mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold dark:text-white text-gray-900 mb-2">Events</h1>
            <p className="dark:text-gray-200 text-gray-600">Discover upcoming events and networking opportunities</p>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {events.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.upcoming.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                  <DotLottieReact
                    src="/lottie/empty.lottie"
                    autoplay
                    loop
                    className="h-40 mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                  <p className="text-gray-500">Check back later for new events</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {events.past.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.past.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                  <DotLottieReact
                    src="/lottie/empty.lottie"
                    autoplay
                    loop
                    className="h-40 mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">No past events</h3>
                  <p className="text-gray-500">Past events will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
