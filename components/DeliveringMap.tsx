"use client";

import React from "react";

export function DeliveringMap({
  origin = "Bratislava",
  destination = "Stuttgart",
  currentPosition = "Lower Austria / Burgenland",
}: {
  origin?: string;
  destination?: string;
  currentPosition?: string;
}) {
  return (
    <div className="relative w-full h-[260px] md:h-[300px] rounded-2xl overflow-hidden bg-[#121319] dark:bg-[#111217] border border-slate-200 dark:border-white/5 shadow-inner">
      {/* SVG Map Graphic */}
      <svg
        className="w-full h-full object-cover select-none pointer-events-none"
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle grid pattern for map texture */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Route Gradient */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          {/* Route Glow */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="600" height="320" fill="url(#grid)" />

        {/* Road & River Network lines */}
        <g stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" strokeLinecap="round">
          {/* Danube river curved line */}
          <path
            d="M 0 110 Q 120 100 220 135 T 380 120 T 520 80 T 600 70"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Minor secondary roads */}
          <path d="M 50 20 L 140 120 L 190 280" />
          <path d="M 220 20 L 260 110 L 320 180 L 400 320" />
          <path d="M 350 40 L 410 90 L 480 160 L 580 200" />
          <path d="M 10 180 L 110 210 L 210 230 L 310 210 L 490 280" />
          <path d="M 120 30 Q 300 80 450 40 L 590 120" strokeWidth="0.8" />
          <path d="M 280 220 L 370 270 L 460 300" strokeWidth="0.8" />
          <path d="M 500 120 L 540 220 L 600 240" strokeWidth="0.8" />
        </g>

        {/* Territory Regions & Boundaries */}
        <g opacity="0.35" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="3 3">
          <path d="M 180 150 C 230 190 310 180 390 220 C 450 250 490 320 500 320" strokeWidth="1.2" />
        </g>

        {/* Region Labels */}
        <text
          x="350"
          y="230"
          fill="rgba(255, 255, 255, 0.3)"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1.5"
          transform="rotate(-25 350 230)"
        >
          LOWER AUSTRIA
        </text>
        <text
          x="365"
          y="255"
          fill="rgba(255, 255, 255, 0.3)"
          fontSize="9"
          fontWeight="700"
          letterSpacing="1.5"
          transform="rotate(-25 365 255)"
        >
          BURGENLAND
        </text>
        <text
          x="485"
          y="225"
          fill="rgba(255, 255, 255, 0.25)"
          fontSize="8"
          fontWeight="700"
          letterSpacing="1.2"
          transform="rotate(-20 485 225)"
        >
          LOWER AUSTRIA
        </text>
        <text
          x="480"
          y="245"
          fill="rgba(255, 255, 255, 0.25)"
          fontSize="8"
          fontWeight="700"
          letterSpacing="1.2"
          transform="rotate(-20 480 245)"
        >
          BURGENLAND
        </text>

        {/* Geographic Town Names */}
        <g fill="rgba(255, 255, 255, 0.25)" fontSize="7" fontFamily="sans-serif">
          <text x="140" y="75">Orth an der Donau</text>
          <text x="240" y="65">Haringsee</text>
          <text x="310" y="72">Engelhartstetten</text>
          <text x="440" y="105">Hainburg an der Donau</text>
          <text x="420" y="145">Deutsch-Altenburg</text>
          <text x="440" y="170">Hundsheim</text>
          <text x="110" y="175">Haslau-Maria</text>
          <text x="200" y="240">Höflein</text>
          <text x="270" y="260">Göttlesbrunn</text>
          <text x="290" y="295">Bruck an der Leitha</text>
          <text x="235" y="305">Wilfleinsdorf</text>
          <text x="120" y="315">Sommerein</text>
          <text x="455" y="295">Parndorf</text>
        </g>

        {/* ACTIVE LOGISTICS HIGHWAY ROUTE (Curved glowing path) */}
        <path
          d="M 2 175 C 60 185 110 200 160 230 C 230 270 300 290 360 260 C 410 235 440 260 480 280 C 510 295 550 290 600 230"
          stroke="url(#routeGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        <path
          d="M 2 175 C 60 185 110 200 160 230 C 230 270 300 290 360 260 C 410 235 440 260 480 280 C 510 295 550 290 600 230"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="4 2"
          opacity="0.9"
        />

        {/* LIVE LOCATION PIN (At Neudorf / Parndorf checkpoint) */}
        <g transform="translate(438, 268)">
          {/* Animated pulse rings */}
          <circle r="16" fill="rgba(99, 102, 241, 0.25)" className="animate-ping" />
          <circle r="10" fill="rgba(99, 102, 241, 0.4)" />
          {/* Marker Pin Icon */}
          <circle r="6" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
          <circle r="2" fill="#ffffff" />
        </g>

        {/* Origin Pin */}
        <g transform="translate(18, 178)">
          <circle r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Floating Status Tag on Map */}
      <div className="absolute bottom-3 left-3 bg-[#16171e]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-slate-200">Live: {currentPosition}</span>
        <span className="text-[10px] text-slate-400 border-l border-white/10 pl-2">78 Km/h</span>
      </div>

      <div className="absolute top-3 right-3 bg-[#16171e]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-mono text-indigo-400 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span>GPS Tracking</span>
      </div>
    </div>
  );
}
