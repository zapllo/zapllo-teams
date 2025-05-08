import React from 'react'

type Props = {}

export default function MainLoader({}: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-[#04061e]/95 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Clean professional spinner */}
        <div className="relative w-16 h-16">
          {/* Main spinner */}
          <div className="w-full h-full rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-[#815BF5] border-t-transparent animate-spin"></div>

          {/* Company logo in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src="/logo/logo.png" alt="Zapllo" className=" scale-150" />
          </div>
        </div>

        {/* Simple professional text */}
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          Loading, please wait...
        </p>
      </div>
    </div>
  )
}
