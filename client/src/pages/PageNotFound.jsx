'use client'

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const [isHovering, setIsHovering] = useState(false)

   const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);


  return (
    <div className="py-20 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* 404 Text with Animation */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 opacity-20 rounded-full"></div>
            <div className="relative">
              <h1 className="text-9xl font-black bg-gradient-to-r from-cyan-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
              Page Not Found!
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-md mx-auto">
              Oops! Looks like this listing went out of stock or the page you're looking for has been removed from the marketplace.
            </p>
          </div>

          {/* Illustration Box */}
          <div className="w-64 h-64 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-pink-100 rounded-3xl border-4 border-dashed border-purple-300 opacity-50"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-2">📦</div>
              <p className="text-sm text-slate-600 font-semibold">Item Lost in Campus</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-4">
            {/* Back Home Button */}
            <a
              href="/"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>← Back to Home</span>
            </a>

            {/* Browse Listings Button */}
            <a
              href="/marketplace"
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-400/50 hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Browse Listings →</span>
            </a>
          </div>

          {/* Helpful Links */}
          <div className="grid grid-cols-3 gap-4 pt-8 w-full max-w-md">
            <a
              href="/marketplace"
              className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-cyan-400 hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛍️</div>
              <p className="text-xs font-semibold text-slate-700">Marketplace</p>
            </a>

            <a
              href="/events"
              className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-pink-400 hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎉</div>
              <p className="text-xs font-semibold text-slate-700">Events</p>
            </a>

            <a
              href="/profile"
              className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all duration-300 group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">👤</div>
              <p className="text-xs font-semibold text-slate-700">Profile</p>
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-10 right-10 w-20 h-20 bg-cyan-200 rounded-full opacity-10 blur-2xl"></div>
        <div className="fixed bottom-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="fixed top-1/3 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-10 blur-2xl"></div>
      </div>
    </div>
  )
}
