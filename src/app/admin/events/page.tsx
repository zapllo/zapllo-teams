'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Plus, Edit, Trash2, Calendar, MapPin, Users, Clock, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '@/components/ui/tabs3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
    };
  }[];
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    coverImage: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    isVirtual: false,
    meetingLink: '',
    capacity: 20
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/events');
      setEvents(res.data.data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      // Format dates
      const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
      const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);

      const eventData = {
        ...newEvent,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString()
      };

      await axios.post('/api/events', eventData);

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setIsModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      coverImage: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      isVirtual: false,
      meetingLink: '',
      capacity: 20
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewEvent(prev => ({
      ...prev,
      isVirtual: checked
    }));
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new event
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event"
                  rows={4}
                  value={newEvent.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="Enter image URL"
                  value={newEvent.coverImage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newEvent.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newEvent.endDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="isVirtual">Virtual Event</Label>
                <Switch
                  id="isVirtual"
                  checked={newEvent.isVirtual}
                  onCheckedChange={handleSwitchChange}
                />
              </div>

              {newEvent.isVirtual ? (
                <div className="grid gap-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    name="meetingLink"
                    placeholder="Enter meeting URL"
                    value={newEvent.meetingLink}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="Maximum number of attendees"
                  value={newEvent.capacity}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderEventCards(events)}
        </TabsContent>

        <TabsContent value="upcoming">
          {renderEventCards(events.filter(e => new Date(e.startDate) > new Date()))}
        </TabsContent>

        <TabsContent value="past">
          {renderEventCards(events.filter(e => new Date(e.endDate) < new Date()))}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderEventCards(eventsToRender: Event[]) {
    if (eventsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <DotLottieReact
            src="/lottie/empty.lottie"
            autoplay
            loop
            className="h-40 mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">Create your first event to get started</p>
          <Button onClick={() => setIsModalOpen(true)}>Create Event</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsToRender.map(event => (
          <Card key={event._id} className="overflow-hidden">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${event.coverImage})` }} />
            <CardHeader className="pb-2">
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{format(new Date(event.startDate), 'PPP')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users size={14} />
                  <span>{event.registrations.length} / {event.capacity} registered</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Edit size={14} /> Edit
                </Button>

                <Button size="sm" variant="destructive" className="flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
