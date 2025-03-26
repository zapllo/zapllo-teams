'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import GradientText from '../magicui/gradient'
import { ChevronRight, MessageCircleQuestion, Search } from 'lucide-react'
import { Input } from '../ui/input'

export default function Faq3() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState<string | null>(null);
    
    const faqItems = [
        {
            id: "item-1",
            question: "What is Zapllo Task Delegation App, and how can it help my business?",
            answer: "Zapllo Tasks is a task delegation and management app designed to help business owners efficiently assign, track, and manage tasks across their teams."
        },
        {
            id: "item-2",
            question: "What kind of notifications does Zapllo Tasks provide?",
            answer: "Zapllo Tasks sends automated WhatsApp and email notifications for task assignments, due dates, and overdue tasks to keep your team informed."
        },
        {
            id: "item-3",
            question: "Can I categorize tasks in Zapllo Tasks?",
            answer: "Yes, you can organize tasks into categories, making it easier to track similar tasks or manage complex projects divided among team members."
        },
        {
            id: "item-4",
            question: "How can I track the status of tasks in Zapllo Tasks?",
            answer: "You can track tasks through the list view, where tasks can be moved from pending to in process to completed. Status updates can also include remarks and milestones."
        },
        {
            id: "item-5",
            question: "Does Zapllo Tasks support adding voice notes and attachments?",
            answer: "Yes, you can add voice notes, links, images, documents, and other references to tasks to provide clear instructions or additional resources."
        },
        {
            id: "item-6",
            question: "Can I set priorities and deadlines for tasks?",
            answer: "Absolutely! When creating tasks, you can set priorities and deadlines to ensure tasks are completed on time."
        },
        {
            id: "item-7",
            question: "How does Zapllo Tasks handle recurring tasks?",
            answer: "Zapllo Tasks allows you to set up recurring tasks with customized frequencies, ensuring repetitive tasks are automatically assigned on schedule."
        },
        {
            id: "item-8",
            question: "Is there a dashboard to monitor overall task performance?",
            answer: "Yes, the dashboard provides an overview of tasks, including those due today, overdue, completed, and pending, filtered by various timeframes."
        },
        {
            id: "item-9",
            question: "How secure is my data in Zapllo Tasks?",
            answer: "Your data is securely stored, ensuring that it is only accessible to authorized users within your organization."
        },
        {
            id: "item-10",
            question: "Can I customize user roles and permissions in Zapllo Tasks?",
            answer: "Yes, admins can create custom roles and assign specific permissions, controlling what each user can view, edit, or manage within the app."
        },
        {
            id: "item-11",
            question: "What reporting features are available in Zapllo Tasks?",
            answer: "Zapllo Tasks offers detailed reporting through the dashboard, including employee-wise, category/project-wise reports, and more."
        },
        {
            id: "item-12",
            question: "Is there any support or training available for Zapllo Tasks?",
            answer: "Yes, we provide educational videos and periodic masterclasses to help you and your team master the app's features."
        },
        {
            id: "item-13",
            question: "How do I update the status of a task?",
            answer: "Task status can be updated by going to task details and adding remarks or milestone updates."
        },
        {
            id: "item-14",
            question: "Can I customize notifications in Zapllo Tasks?",
            answer: "Yes, you can add custom notifications for tasks from Settings."
        },
        {
            id: "item-15",
            question: "How does Zapllo Tasks help in managing team workload?",
            answer: "Zapllo Tasks allows you to delegate and monitor tasks efficiently, ensuring balanced workload distribution across your team."
        },
        {
            id: "item-16",
            question: "Is there an option to track task history or changes?",
            answer: "Yes, Zapllo Tasks keeps a history of changes and updates made to tasks, allowing you to track progress and modifications over time. This is achieved through status updates section."
        }
    ];

    const filteredFaq = searchTerm 
        ? faqItems.filter(item => 
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : faqItems;

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <GradientText>
                    <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl md:text-4xl mb-2'>Frequently Asked Questions</h1>
                </GradientText>
                <h2 className='md:text-3xl text-2xl text-center mx-4 md:mx-0 font-bold mt-2'>
                    You have Questions, We have Answers
                </h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Everything you need to know about our Task Delegation App. Can&apos;t find the answer you&apos;re looking for? 
                    <a href="#" className="text-[#815BF5] ml-1 hover:underline">Reach out to our support team</a>.
                </p>
            </motion.div>
            
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="relative max-w-2xl mx-auto mb-10"
           >
               <div className="relative">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input 
                       type="text" 
                       placeholder="Search for answers..." 
                       className="pl-10 py-6 bg-[#0A0D28]/70 border-[#815BF5]/30 rounded-full focus-visible:ring-[#815BF5]"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                   />
               </div>
           </motion.div>

           <div className='mt-8 space-y-4 max-w-4xl mx-auto'>
               <Accordion 
                   type="single" 
                   collapsible 
                   className='space-y-4'
                   value={openItem || undefined}
                   onValueChange={setOpenItem}
               >
                   <AnimatePresence>
                       {filteredFaq.length > 0 ? (
                           filteredFaq.map((item) => (
                               <motion.div
                                   key={item.id}
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   exit={{ opacity: 0, height: 0 }}
                                   transition={{ duration: 0.2 }}
                               >
                                   <AccordionItem 
                                       value={item.id}
                                       className="bg-[#0A0D28]/70 border border-[#815BF5]/20 rounded-lg overflow-hidden"
                                   >
                                       <AccordionTrigger className="px-6 py-4 hover:bg-[#1A1E48]/50 transition-all">
                                           <div className="flex gap-3 items-center text-left">
                                               <MessageCircleQuestion className={`h-5 w-5 flex-shrink-0 ${openItem === item.id ? 'text-[#815BF5]' : 'text-muted-foreground'}`} />
                                               <span className={`font-medium ${openItem === item.id ? 'text-[#815BF5]' : ''}`}>
                                                   {item.question}
                                               </span>
                                           </div>
                                       </AccordionTrigger>
                                       <AccordionContent className="px-6 pb-4 pt-2">
                                           <div className="pl-8 text-muted-foreground">
                                               {item.answer}
                                           </div>
                                       </AccordionContent>
                                   </AccordionItem>
                               </motion.div>
                           ))
                       ) : (
                           <motion.div
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="text-center py-12"
                           >
                               <p className="text-muted-foreground">No results found for &quot;{searchTerm}&quot;</p>
                               <button 
                                   onClick={() => setSearchTerm('')}
                                   className="mt-2 text-[#815BF5] hover:underline"
                               >
                                   Clear search
                               </button>
                           </motion.div>
                       )}
                   </AnimatePresence>
               </Accordion>
           </div>

           <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="mt-12 text-center"
           >
               <p className="text-muted-foreground">Still have questions?</p>
               <a 
                   href="/contact" 
                   className="mt-2 inline-flex items-center text-[#815BF5] hover:underline"
               >
                   Contact our support team <ChevronRight className="h-4 w-4 ml-1" />
               </a>
           </motion.div>
       </div>
   )
}