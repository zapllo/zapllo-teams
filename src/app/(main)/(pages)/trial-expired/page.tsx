import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function TrialExpired({ }: Props) {
    return (
        <div>
            <div className='p-4 text-center mt-32'>
                <h1 className='text-xl font-bold text-red-500'>Your trial has expired!</h1>
                <p>Please purchase a subscription to continue using the Task Management features.</p>
                <Link href='/dashboard/billing'>
                    <Button className='h-10 bg-white text-black hover:text-white mt-4 text-lg '>👑 Upgrade to Pro</Button>
                </Link>
            </div>
        </div>
    )
}