import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import GradientText from '../magicui/gradient'

export default function Faq3() {
    return (
        <div>
            <GradientText>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl'>FAQ</h1>
            </GradientText>
            <h1 className='md:text-3xl text-2xl text-center mx-4 md:mx-0 font-bold mt-2'>You have Questions, We have Answers</h1>
            <div className='mt-12 space-y-4'>
                <Accordion type="single" collapsible className='md:w-[900px] md:mx-0 mx-4 space-y-4'>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is Zapllo Task Delegation App, and how can it help my business?
                        </AccordionTrigger>
                        <AccordionContent>

                            Zapllo Tasks is a task delegation and management app designed to help business owners efficiently assign, track, and manage tasks across their teams.


                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className=''>
                            What kind of notifications does Zapllo Tasks provide?

                        </AccordionTrigger>
                        <AccordionContent>

                            Zapllo Tasks sends automated WhatsApp and email notifications for task assignments, due dates, and overdue tasks to keep your team informed.

                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            Can I categorize tasks in Zapllo Tasks?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, you can organize tasks into categories, making it easier to track similar tasks or manage complex projects divided among team members.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            How can I track the status of tasks in Zapllo Tasks?
                        </AccordionTrigger>
                        <AccordionContent>

                            You can track tasks through the list view, where tasks can be moved from pending to in process to completed. Status updates can also include remarks and milestones.

                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>
                            Does Zapllo Tasks support adding voice notes and attachments?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, you can add voice notes, links, images, documents, and other references to tasks to provide clear instructions or additional resources.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>
                            Can I set priorities and deadlines for tasks?
                        </AccordionTrigger>
                        <AccordionContent>
                            Absolutely! When creating tasks, you can set priorities and deadlines to ensure tasks are completed on time.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger>

                            How does Zapllo Tasks handle recurring tasks?

                        </AccordionTrigger>
                        <AccordionContent>

                            Zapllo Tasks allows you to set up recurring tasks with customized frequencies, ensuring repetitive tasks are automatically assigned on schedule.

                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger>
                            Is there a dashboard to monitor overall task performance?

                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, the dashboard provides an overview of tasks, including those due today, overdue, completed, and pending, filtered by various timeframes.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                        <AccordionTrigger>

                            How secure is my data in Zapllo Tasks?
                        </AccordionTrigger>
                        <AccordionContent>
                            Your data is securely stored, ensuring that it is only accessible to authorized users within your organization.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-10">
                        <AccordionTrigger>
                            Can I customize user roles and permissions in Zapllo Tasks?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, admins can create custom roles and assign specific permissions, controlling what each user can view, edit, or manage within the app.

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-11">
                        <AccordionTrigger>
                            What reporting features are available in Zapllo Tasks?

                        </AccordionTrigger>
                        <AccordionContent>
                            Zapllo Tasks offers detailed reporting through the dashboard, including employee-wise, category/project-wise reports, and more.

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-12">
                        <AccordionTrigger>
                            Is there any support or training available for Zapllo Tasks?

                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, we provide educational videos and periodic masterclasses to help you and your team master the app&apos;s features.

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-13">
                        <AccordionTrigger>
                            How do I update the status of a task?


                        </AccordionTrigger>
                        <AccordionContent>
                            Task status can be updated by going to task details and adding remarks or milestone updates.


                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-14">
                        <AccordionTrigger>
                            Can I customize notifications in Zapllo Tasks?


                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, you can add custom notifications for tasks from Settings.


                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-15">
                        <AccordionTrigger>

                            How does Zapllo Tasks help in managing team workload?


                        </AccordionTrigger>
                        <AccordionContent>
                            Zapllo Tasks allows you to delegate and monitor tasks efficiently, ensuring balanced workload distribution across your team.


                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-16">
                        <AccordionTrigger>
                            Is there an option to track task history or changes?

                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, Zapllo Tasks keeps a history of changes and updates made to tasks, allowing you to track progress and modifications over time. This is achieved through status updates section.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </div>
    )
}
