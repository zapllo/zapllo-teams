import React from 'react'
import SkewedInfiniteScroll from '../ui/skewed-infinite-scroll'
import { BookCall } from '../ui/bookcall'
import { Golos_Text } from 'next/font/google'
import { TopPicks } from './toppicks';

const golos = Golos_Text({ subsets: ["latin"] });


export default function Tools() {
    return (
        <div className=' '>
            <TopPicks />
        </div>
    )
}
