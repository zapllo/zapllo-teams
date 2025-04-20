'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Calendar, MapPin, Users, Clock, Link as LinkIcon,
  ArrowLeft, MessageSquare, Send
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ChecklistSidebar from '@/components/sidebar/checklistSidebar';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  email?: string;
}

interface Comment {
  _id: string;
  text: string;
  user: User;
  createdAt: string;
}

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
  createdBy: User;
  registrations: {
    user: User;
    registeredAt: string;
  }[];
  comments: Comment[];
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch event details and check if user is registered
  useEffect(() => {
    const fetchEventAndUserData = async () => {
      try {
        setLoading(true);

        // Fetch event details
        const eventRes = await axios.get(`/api/events/${params.id}`);
        setEvent(eventRes.data.data);

        // Fetch current user details
        const userRes = await axios.get('/api/users/me');
        setCurrentUserId(userRes.data.data._id);

        // Check if user is registered
        const isRegistered = eventRes.data.data.registrations.some(
          (reg: any) => reg.user._id === userRes.data.data._id
        );
        setUserRegistered(isRegistered);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndUserData();
  }, [params.id]);

  // Handle registration
  const handleRegistration = async () => {
    try {
      setRegistering(true);
      if (userRegistered) {
        await axios.delete(`/api/events/${params.id}/register`);
        toast.success("You have successfully unregistered from this event");
        setUserRegistered(false);
      } else {
        await axios.post(`/api/events/${params.id}/register`);
        toast.success("You have successfully registered for this event");
        setUserRegistered(true);
      }

      // Refresh event data
      const eventRes = await axios.get(`/api/events/${params.id}`);
      setEvent(eventRes.data.data);
    } catch (err: any) {
      toast.error(" Failed to update registration status");
    } finally {
      setRegistering(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`/api/events/${params.id}/comments`, { text: comment });

      // Update comments in state
      if (event) {
        setEvent({
          ...event,
          comments: [...event.comments, res.data.data]
        });
      }

      setComment('');
      toast.success("Comment posted successfully");
    } catch (err: any) {
      toast("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotLottieReact
          src="/lottie/loading.lottie"
          autoplay
          loop
          className="h-40"
        />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600">{error || "The event you're looking for doesn't exist"}</p>
        </div>
        <Link href="/help/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isEventFull = event.registrations.length >= event.capacity;
  const isPastEvent = new Date(event.endDate) < new Date();

  return (
    <div className="flex h-full max-h-screen overflow-y-scroll  pt-24">
    <ChecklistSidebar />
    <div className="flex-1 px-4 pl-64 mt-">
      <div className="mb-6">
        <Link href="/help/events">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Events
          </Button>
        </Link>
      </div>

      {/* Event header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <img
          src={event.coverImage}
          alt={event.title}
          className="object-fill w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-200">Created by {event.createdBy.firstName} {event.createdBy.lastName}</p>
        </div>
        {isPastEvent && (
          <Badge variant="destructive" className="absolute top-6 right-6">
            Past Event
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event details */}
        <div className="lg:col-span-2">
          <div className="dark:bg-transparent bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="dark:text-gray-300 text-gray-700 whitespace-pre-line mb-6">{event.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-500" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="dark:text-gray-300 text-gray-600">{format(new Date(event.startDate), 'PPPP')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-500" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="dark:text-gray-300 text-gray-600">
                    {format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="dark:text-gray-300 text-gray-600">{event.isVirtual ? 'Virtual Event' : event.location}</p>
                </div>
              </div>

              {event.isVirtual && event.meetingLink && userRegistered && (
                <div className="flex items-center gap-3">
                  <LinkIcon className="text-blue-500" />
                  <div>
                    <p className="font-medium">Meeting Link</p>
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Join virtual event
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white dark:bg-transparent rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-blue-500" />
              <h2 className="text- font-bold">Discussion ({event.comments.length})</h2>
            </div>

            {/* Comment input (only for registered users) */}
            {userRegistered ? (
              <div className="mb-6">
                <Textarea
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3 placeholder:text-muted-foreground text-black dark:text-white"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={submitting || !comment.trim()}
                  className="flex items-center gap-2"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                  <Send size={16} />
                </Button>
              </div>
            ) : (
              <div className="mb-6 p-4 dark:bg-transparent bg-gray-50 rounded-lg text-center">
                <p className="dark:text-white text-gray-600">Register for this event to join the discussion</p>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-6">
              {event.comments.length > 0 ? (
                event.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={comment.user.profilePic} />
                      <AvatarFallback>
                        {comment.user.firstName[0]}{comment.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="font-medium">
                          {comment.user.firstName} {comment.user.lastName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'PPp')}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration card */}
          <div className="dark:bg-transparent bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className=" items-center gap-2">
                <Users className="text-blue-500" />
                <h3 className="font-bold">Attendance</h3>
              </div>
              <span className="text-sm  bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {event.registrations.length}/{event.capacity} spots filled
              </span>
            </div>

            <div className="mb-6">
              <Button
                onClick={handleRegistration}
                disabled={registering || (!userRegistered && (isEventFull || isPastEvent))}
                variant={userRegistered ? "outline" : "default"}
                className="w-full mb-2"
              >
                {registering
                  ? "Processing..."
                  : userRegistered
                  ? "Cancel Registration"
                    : isPastEvent
                      ? "Event Ended"
                      : isEventFull
                        ? "Event Full"
                        : "Register Now"}
              </Button>

              {isPastEvent && (
                <p className="text-sm text-gray-500 text-center">
                  This event has already ended
                </p>
              )}
              {isEventFull && !userRegistered && !isPastEvent && (
                <p className="text-sm text-gray-500 text-center">
                  This event has reached maximum capacity
                </p>
              )}
            </div>

            {/* Registered users */}
            <div>
              <h4 className="font-medium mb-3">Registered Attendees</h4>
              {event.registrations.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {event.registrations.map((reg) => (
                    <div key={reg.user._id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reg.user.profilePic} />
                        <AvatarFallback>
                          {reg.user.firstName[0]}{reg.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {reg.user.firstName} {reg.user.lastName}
                        </p>
                        {reg.user._id === currentUserId && (
                          <span className="text-xs text-blue-600">You</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No attendees yet</p>
              )}
            </div>
          </div>

          {/* Share card */}
          <div className="bg-white dark:bg-transparent border rounded-xl shadow-md p-6">
            <h3 className="font-bold mb-4">Share This Event</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast("Event link copied to clipboard!");
                }}
                className="flex-1"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
