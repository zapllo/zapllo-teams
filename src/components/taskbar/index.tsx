'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { taskOptions } from '@/lib/constants'
import clsx from 'clsx'
import { Separator } from '@/components/ui/separator'
import { Database, GitBranch, LucideMousePointerClick } from 'lucide-react'
// import { ModeToggle } from '../global/mode-toggle'
// import { ModeToggle } from '../global/mode-toggle'

type Props = {}

const TaskOptions = (props: Props) => {
    const pathName = usePathname()

    return (
        <nav className=" dark:bg-[#211124] w-64 h-screen  overflow-scroll scrollbar-hide  justify- flex items- flex-col rounded-b-none   gap-10 py-4 justify-start">
            <div className="flex ml-5 mt-4 -center justify-center flex-col gap-8">
                {/* <Link
                    className="flex font-bold flex-row "
                    href="/"
                >
                    <img src='/Favicon.png' className='h-10 w-10' />
                </Link> */}
                {taskOptions.map((menuItem) => (
                    <ul className={
                        `${pathName === menuItem.href ? "bg-[#74517A] font-bold  rounded-md p-2 px-4" : ""}   bg- rounded-md p-2 ':
                           ,
                    `} key={menuItem.name}>

                        <li className='flex gap-4'>
                            <Link
                                href={menuItem.href}
                                className={clsx(
                                    'group h-5 w-5 flex items-center justify-center  scale-[1.5] rounded-lg p-[3px]  cursor-pointer',
                                   
                                )}
                            >
                                <menuItem.Component
                                    selected={pathName === menuItem.href}
                                />
                            </Link>
                            <Link
                                href={menuItem.href} >
                                <p className='text-  text-start'>{menuItem.name}</p>
                            </Link>
                        </li>



                    </ul>
                ))}

                {/* <div className="flex items-center flex-col gap-9 dark:bg-[#353346]/30 py-4 px-2 rounded-full overflow-scroll scrollbar-hide border-[1px]">
                    <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
                        <LucideMousePointerClick
                            className="dark:text-white"
                            size={18}
                        />
                        <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]" />
                    </div>
                    <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
                        <GitBranch
                            className="text-muted-foreground"
                            size={18}
                        />
                        <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
                    </div>
                    <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
                        <Database
                            className="text-muted-foreground"
                            size={18}
                        />
                        <div className="border-l-2 border-muted-foreground/50 h-6 absolute left-1/2 transform translate-x-[-50%] -bottom-[30px]"></div>
                    </div>
                    <div className="relative dark:bg-[#353346]/70 p-2 rounded-full dark:border-t-[2px] border-[1px] dark:border-t-[#353346]">
                        <GitBranch
                            className="text-muted-foreground"
                            size={18}
                        />
                    </div>
                </div> */}
            </div>

        </nav >
    )
}

export default TaskOptions
