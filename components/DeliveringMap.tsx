"use client";

import React from "react";

export function DeliveringMap({
  origin = "",
  destination = "",
  currentPosition = "",
}: {
  origin?: string;
  destination?: string;
  currentPosition?: string;
}) {
  const hasActiveShipment = Boolean(origin && destination && origin !== "—");

  return (
    <div className="relative w-full h-[260px] md:h-[300px] rounded-2xl overflow-hidden bg-[#0d0e14] dark:bg-[#0b0c10] border border-slate-200/80 dark:border-white/10 shadow-inner">
      {/* SVG Map Graphic */}
      <svg
        className="w-full h-full object-cover select-none pointer-events-none"
        viewBox="0 0 600 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle grid pattern for map texture */}
          <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Dynamic Route Gradient */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-accent, #f59e0b)" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          {/* Route Glow */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect width="600" height="320" fill="url(#radarGrid)" />

        {/* Generic Global Corridors & Shipping Lanes */}
        <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeLinecap="round">
          {/* Main Maritime Corridors */}
          <path
            d="M 20 180 Q 180 140 310 190 T 580 130"
            stroke="rgba(56, 189, 248, 0.15)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path d="M 60 40 L 160 140 L 220 260" strokeWidth="0.8" />
          <path d="M 240 30 L 290 120 L 360 210 L 440 290" strokeWidth="0.8" />
          <path d="M 380 50 L 450 110 L 520 180" strokeWidth="0.8" />
          <path d="M 40 220 L 150 240 L 280 250 L 420 230 L 560 270" strokeWidth="0.8" />
          <path d="M 140 50 Q 320 90 480 60 L 580 140" strokeWidth="0.8" />
        </g>

        {/* Geopolitical Neutral Meridian Guidelines */}
        <g stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="2 3">
          <line x1="150" y1="0" x2="150" y2="320" />
          <line x1="300" y1="0" x2="300" y2="320" />
          <line x1="450" y1="0" x2="450" y2="320" />
          <line x1="0" y1="160" x2="600" y2="160" />
        </g>

        {/* Coordinates Labels */}
        <g fill="rgba(255, 255, 255, 0.2)" fontSize="8" fontFamily="monospace">
          <text x="12" y="24">ZONE 01 / ATLANTIC CORRIDOR</text>
          <text x="470" y="308">TRACKING GRID · GPS</text>
        </g>

        {/* Active Route Rendering */}
        {hasActiveShipment ? (
          <>
            {/* Glowing active route line */}
            <path
              d="M 60 190 C 130 150 240 180 340 220 C 420 250 490 230 540 170"
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#routeGlow)"
            />
            <path
              d="M 60 190 C 130 150 240 180 340 220 C 420 250 490 230 540 170"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 3"
              opacity="0.85"
            />

            {/* Origin Pin */}
            <g transform="translate(60, 190)">
              <circle r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              <text x="10" y="4" fill="#93c5fd" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                {origin}
              </text>
            </g>

            {/* Destination Pin */}
            <g transform="translate(540, 170)">
              <circle r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
              <text x="-12" y="-8" textAnchor="end" fill="#d8b4fe" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                {destination}
              </text>
            </g>

            {/* Live GPS Marker */}
            <g transform="translate(340, 220)">
              <circle r="16" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
              <circle r="10" fill="rgba(245, 158, 11, 0.4)" />
              <circle r="6" fill="var(--primary-accent, #f59e0b)" stroke="#ffffff" strokeWidth="2" />
              <circle r="2" fill="#ffffff" />
            </g>
          </>
        ) : (
          /* Neutral radar sweep center */
          <g transform="translate(300, 160)">
            <circle r="60" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
            <circle r="30" fill="none" stroke="rgba(255, 255, 255, 0.08)" />
            <circle r="4" fill="rgba(255, 255, 255, 0.3)" />
          </g>
        )}
      </svg>

      {/* Floating Status Tag on Map */}
      <div className="absolute bottom-3 left-3 bg-[#13141d]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-white shadow-lg">
        {hasActiveShipment ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              Live: {currentPosition || "En Tránsito"}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-medium text-slate-300">
              GPS en Espera · Sin cargas en tránsito
            </span>
          </>
        )}
      </div>

      <div className="absolute top-3 right-3 bg-[#13141d]/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span>Global Tracker</span>
      </div>
    </div>
  );
}
