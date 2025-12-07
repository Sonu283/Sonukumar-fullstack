"use client";

import { useEffect, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80",
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        
        {slides.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out
            ${current === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40"></div>
          </div>
        ))}

        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 
                ${current === index ? "bg-white scale-110" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <section className="px-6 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Welcome to Our Modern E-Commerce Store
        </h1>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Discover premium products, exclusive discounts, and the best shopping
          experience. Powered by a fully integrated backend system.
        </p>

        <a
          href="/products"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-black text-white text-lg font-semibold hover:bg-gray-800 transition"
        >
          Start Shopping →
        </a>
      </section>
    </main>
  );
}
