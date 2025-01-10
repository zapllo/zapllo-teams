// TestimonialCards.js

"use client";

import React from "react";
import { AiFillStar } from "react-icons/ai";

export function TestimonialCards2() {
  return (
    <div className="h-[25rem] flex flex-col items-center justify-center p-8 scroll-none">
      <div className="flex overflow-x-auto space-x-4 px-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-[#0B0C24] text-white rounded-xl shadow-lg p-6 w-[300px] md:w-[350px] h-[300px] flex flex-col justify-between"
          >
            <div className="flex flex-col items-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4"
              />
              <p className="text-lg font-semibold text-white">
                {testimonial.name}
              </p>
              <p className="text-sm text-gray-400">{testimonial.title}</p>
              <div className="flex space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} className="text-yellow-500" />
                ))}
              </div>
            </div>
            <p className="mt-4 text-gray-300 text-sm text-center line-clamp-3">
              {testimonial.quote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "We are now associated with Zapllo for about 2 years now. Highly recommended.",
    name: "Emily Haile",
    title: "Director, Talent & Operations",
    image: "emily.png",
  },
  {
    quote:
      "I am stunned how automation and AI saved us from putting multiple hours per day on customer onboarding. Deep is magic at developing amazing automations. No doubt he is the best. Highly recommended.",
    name: "Gar Lee",
    title: "Customer Success, Daily.Ai",
    image: "lee.png",
  },
  {
    quote:
      "I am stunned how automation and AI saved us from putting multiple hours per day on customer onboarding. Deep is magic at developing amazing automations. No doubt he is the best. Highly recommended.",
    name: "Gar Lee",
    title: "Customer Success, Daily.Ai",
    image: "lee.png",
  },
  // Add other testimonials similarly
];
