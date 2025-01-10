import Image from 'next/image';

const SkewedInfiniteScroll = () => {
    const items = [
        { id: '1', text: 'Discord', image: '/discord.png' },
        { id: '2', text: 'Notion', image: '/notion.png' },
        { id: '3', text: 'WhatsApp', image: '/whatsapp.png' },
        { id: '4', text: 'Google Drive', image: '/googledrive.png' },
        { id: '5', text: 'Slack', image: '/slack.png' },
        { id: '6', text: 'Discord', image: '/discord.png' },
        { id: '7', text: 'Notion', image: '/notion.png' },
        { id: '8', text: 'WhatsApp', image: '/whatsapp.png' },
    ];

    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="relative w-full max-w-screen-lg overflow-hidden">
                    <div className="pointer-events-none absolute -top-1 z-10 h-20 w-full bg-gradient-to-b from-[#05071E]"></div>
                    <div className="pointer-events-none absolute -bottom-1 z-10 h-20 w-full bg-gradient-to-t from-[#05071E]"></div>
                    <div className="pointer-events-none absolute -left-1 z-10 h-full w-12 bg-gradient-to-r from-[#05071E]"></div>
                    <div className="pointer-events-none absolute -right-1 z-10 h-full w-10 bg-gradient-to-l from-[#05071E]"></div>

                    <div className="animate-skew-scroll mx-auto grid h-[280px] w-[300px] grid-cols-1 gap-5 sm:w-[600px] sm:grid-cols-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-100 px-5 shadow-md transition-all hover:-translate-y-1 hover:translate-x-1 hover:scale-[1.025] hover:shadow-xl"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.text}
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 flex-none"
                                />
                                <p className="text-white">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkewedInfiniteScroll;
