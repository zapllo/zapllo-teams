import React from 'react'
import PayrollFaq from './Faq'
import SaveMore from './save'

type Props = {}

export default function TaskFeatures({ }: Props) {
    return (
        <div className='w-full flex justify-center'>
            <div className='mb-16 max-w-5xl w-full mt-20 '>
                <div className='flex justify-center'>
                    <h1 className='text-center text-xl md:text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        Zapllo Tasks App Features
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 text-xl md:text-3xl mt-4'>
                    How Zapllo Tasks App saves 4 hours of each Employee?
                </h1>
                <div className='grid md:grid-cols-2 mx-12 md:mx-0 max-w-5xl   gap-4'>
                    <div className=' h-[648px] md:block hidden relative rounded-xl'>
                        <img src='/product/tasks.png' className='rounded-xl h-full object-cover' />
                    </div>
                    <div className='mt-12 rounded-xl'>
                        <h1 className='text-xl md:text-3xl font-bold'>Effortless Task Delegation</h1>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/assigned.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Task Assignment
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Assign tasks with deadlines and priorities, allow assigners to choose frequency, and ensure efficient completion and management.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Recurring Tasks-Daily, Weekly & Monthly
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Set up recurring tasks that need to be done on a periodic basis.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/progress.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Task Progress Updation

                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Teammates stay updated on tasks and report progress to ensure assigners are kept informed.
                        </p>
                    </div>
                    <div className=' h-[648px] block md:hidden relative rounded-xl'>
                        <img src='/product/tasks.png' className='rounded-xl h-full object-cover' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 max-w-5xl mx-12 md:mx-0   gap-4'>
                    <div className='mt-12 rounded-xl'>
                        <h1 className=' text-xl md:text-3xl font-bold'>Task Tracking & MIS Reports</h1>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/assigned.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Department wise Dashboard
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Get real-time updates on tasks, including completion notifications and milestone achievements.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Employee Performance
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Analyze employee performance with MIS scores, fostering responsibility and accountability.
                        </p>


                    </div>
                    <div className=' w-full h-auto relative rounded-xl'>
                        <img src='/product/performance.png' className='rounded-xl h-full scale-125  object-cover' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2  max-w-5xl   gap-4'>
                    <div className=' w-full h-auto md:block hidden relative rounded-xl'>
                        <img src='/product/reminders.png' className='rounded-xl h-full w-full object-cover' />
                    </div>
                    <div className=' mx-12 rounded-xl'>
                        <h1 className='text-xl md:text-3xl font-bold'>Notifications & Reminders                        </h1>
                        <div className='flex gap-4  mt-4 items-center'>
                            <img src='/product/icons/bell.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Instant WhatsApp & Email Reminders
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Automated reminders and notifications about tasks and deliverables.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Daily Reminders on WhatsApp
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Employees get Daily Reminder for pending Tasks which pushes them to complete on time
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl'>
                                Notification Subscriptions
                            </h1>
                        </div>
                        <p className='text-muted-foreground mt-4 text-sm'>
                            Admin and manager can subscribe to any task and get notifications about that tasks.
                        </p>

                    </div>
                    <div className=' w-full h-auto block md:hidden relative rounded-xl'>
                        <img src='/product/reminders.png' className='rounded-xl h-full w-full object-cover' />
                    </div>

                </div>
                <div className='grid mx-12 md:mx-0 mt-24 md:grid-cols-2 max-w-5xl   gap-4'>
                    <div>
                        <h1 className='text-xl md:text-3xl font-bold'>Say GoodBye to Miscommunications</h1>
                        <div className='flex gap-4  mt-8 items-center'>
                            <img src='/product/icons/audio.png' className='h-12 ' />
                            <h1 className='text-2xl font-medium '>
                                Audio Notes
                            </h1>
                        </div>
                        <p className='mt-4 max-w-md text-muted-foreground'>
                            While assigning tasks, you can add audio note to explain in detail about how to perform a specific tasks or what to avoid.
                        </p>
                        <div className='flex gap-4  mt-8 items-center'>
                            <img src='/product/icons/attachments.png' className='h-12 ' />
                            <h1 className='text-2xl font-medium '>
                                KRAs
                            </h1>
                        </div>
                        <p className='mt-4 max-w-md text-muted-foreground'>
                            Every team leader and manager will be able to assign, modify and delete KRAs to each team member.
                        </p>
                        <div className='flex gap-4  mt-8 items-center'>
                            <img src='/product/icons/reminders.png' className='h-12 ' />
                            <h1 className='text-2xl font-medium '>
                                Templates Directory

                            </h1>
                        </div>
                        <p className='mt-4 max-w-md text-muted-foreground'>
                            Predefined department-wise task templates for you to use.
                        </p>
                        <div className='flex gap-4  mt-8 items-center'>
                            <img src='/product/icons/export.png' className='h-12 ' />
                            <h1 className='text-2xl font-medium '>
                                Upload
                            </h1>
                        </div>
                        <p className='mt-4 max-w-md text-muted-foreground'>
                            Every Admin, Manager and Team Members can upload and attach any kind of files which are relatable to the task.
                        </p>
                    </div>
                    <div className=' h-[648px] -ml-14  mt-10 relative rounded-xl'>
                        <img src='/product/tasks.png' className='rounded-xl h-full w-full scale-90 md:scale-100 object-cover' />
                    </div>
                </div>
                <SaveMore />

            </div>

        </div>
    )
};