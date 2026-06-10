import React from 'react';

/**
 * AnimatedTree component renders a highly stylized, responsive SVG tree
 * with organic branch structures, roots, and layered leaf groups that sway gently.
 * It uses the design system's CSS keyframes (`sway`, `sway-reverse`, `float`)
 * to create a premium, interactive nature visual.
 */
export default function AnimatedTree({ className = "" }) {
  return (
    <div className={`tree-canvas ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 500 500" 
        className="animated-tree-svg"
        width="100%" 
        height="100%"
      >
        {/* Decorative Ground Ring */}
        <ellipse 
          cx="250" 
          cy="460" 
          rx="120" 
          ry="15" 
          fill="rgba(34, 112, 63, 0.08)" 
        />
        <ellipse 
          cx="250" 
          cy="460" 
          rx="80" 
          ry="10" 
          fill="rgba(11, 45, 100, 0.05)" 
        />

        {/* Root Flares */}
        <path d="M 230,450 C 210,460 180,465 170,470 C 180,455 210,450 230,445 Z" fill="#3D230E" />
        <path d="M 270,450 C 290,460 320,465 330,470 C 320,455 290,450 270,445 Z" fill="#3D230E" />
        <path d="M 250,450 C 250,462 255,468 258,472 C 248,468 245,462 250,450 Z" fill="#2E1A0A" />

        {/* Tree Trunk */}
        <path 
          className="tree-trunk" 
          d="M 225,450 
             C 230,380 220,320 230,260 
             C 235,220 240,180 245,150 
             L 255,150 
             C 260,180 265,220 270,260 
             C 280,320 270,380 275,450 
             Z" 
          fill="#4A2B11" 
        />
        
        {/* Trunk bark texture lines */}
        <path d="M 240,430 C 245,390 240,330 245,280" stroke="#3D230E" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 260,420 C 255,370 260,310 255,250" stroke="#3D230E" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 248,360 C 250,330 248,300 252,270" stroke="#3D230E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />

        {/* LEFT BRANCH SYSTEM (Primary Sway) */}
        <g className="tree-branch-group">
          {/* Main Left Branch */}
          <path 
            d="M 233,280 
               C 190,260 150,265 110,290 
               C 130,270 170,250 238,252 
               Z" 
            fill="#4A2B11" 
          />
          {/* Left Sub-branch */}
          <path 
            d="M 150,266 
               C 120,240 90,245 60,260 
               C 80,245 110,235 145,255 
               Z" 
            fill="#4A2B11" 
          />
          {/* Left High Branch */}
          <path 
            d="M 242,210 
               C 180,180 140,160 100,180 
               C 130,165 170,165 244,195 
               Z" 
            fill="#4A2B11" 
          />
          
          {/* Left Leaf Clusters (Mix of Forest Greens and APCS Gold Accents) */}
          {/* Outer Left Low */}
          <g className="tree-leaf-cluster tree-leaf-cluster-delay" style={{ transformOrigin: '95px 290px' }}>
            <circle cx="95" cy="290" r="38" fill="var(--color-green)" opacity="0.95" />
            <circle cx="85" cy="275" r="28" fill="#1C5E33" />
            <circle cx="110" cy="295" r="24" fill="var(--color-gold)" opacity="0.9" />
            <circle cx="75" cy="300" r="20" fill="var(--color-green)" />
          </g>

          {/* Outer Left Mid */}
          <g className="tree-leaf-cluster" style={{ transformOrigin: '55px 255px' }}>
            <circle cx="55" cy="255" r="32" fill="#2E7D32" />
            <circle cx="65" cy="245" r="24" fill="var(--color-green)" opacity="0.9" />
            <circle cx="45" cy="265" r="20" fill="#1B5E20" />
            {/* Soft gold accent leaf */}
            <circle cx="60" cy="265" r="14" fill="var(--color-gold)" />
          </g>

          {/* High Left */}
          <g className="tree-leaf-cluster tree-leaf-cluster-delay" style={{ transformOrigin: '90px 175px' }}>
            <circle cx="90" cy="175" r="36" fill="var(--color-green)" />
            <circle cx="80" cy="160" r="28" fill="var(--color-gold)" opacity="0.95" />
            <circle cx="105" cy="170" r="22" fill="#1E5230" />
          </g>
        </g>

        {/* RIGHT BRANCH SYSTEM (Reverse Sway) */}
        <g className="tree-branch-group-alt">
          {/* Main Right Branch */}
          <path 
            d="M 267,280 
               C 310,260 350,265 390,290 
               C 370,270 330,250 262,252 
               Z" 
            fill="#4A2B11" 
          />
          {/* Right Sub-branch */}
          <path 
            d="M 350,266 
               C 380,240 410,245 440,260 
               C 420,245 390,235 355,255 
               Z" 
            fill="#4A2B11" 
          />
          {/* Right High Branch */}
          <path 
            d="M 258,210 
               C 320,180 360,160 400,180 
               C 370,165 330,165 256,195 
               Z" 
            fill="#4A2B11" 
          />

          {/* Right Leaf Clusters */}
          {/* Outer Right Low */}
          <g className="tree-leaf-cluster" style={{ transformOrigin: '405px 290px' }}>
            <circle cx="405" cy="290" r="38" fill="var(--color-green)" opacity="0.95" />
            <circle cx="415" cy="275" r="28" fill="var(--color-gold)" opacity="0.95" />
            <circle cx="390" cy="295" r="24" fill="#1C5E33" />
            <circle cx="425" cy="300" r="20" fill="var(--color-green)" />
          </g>

          {/* Outer Right Mid */}
          <g className="tree-leaf-cluster tree-leaf-cluster-delay" style={{ transformOrigin: '445px 255px' }}>
            <circle cx="445" cy="255" r="32" fill="#2E7D32" />
            <circle cx="435" cy="245" r="24" fill="var(--color-green)" opacity="0.9" />
            <circle cx="455" cy="265" r="20" fill="#1B5E20" />
            <circle cx="430" cy="265" r="14" fill="var(--color-gold)" />
          </g>

          {/* High Right */}
          <g className="tree-leaf-cluster" style={{ transformOrigin: '410px 175px' }}>
            <circle cx="410" cy="175" r="36" fill="var(--color-green)" />
            <circle cx="420" cy="160" r="28" fill="#1E5230" />
            <circle cx="395" cy="170" r="22" fill="var(--color-gold)" opacity="0.9" />
          </g>
        </g>

        {/* TOP CANOPY SYSTEM (Center / High Vertical) */}
        <g className="tree-branch-group" style={{ animationDuration: '8s' }}>
          {/* Top Fork Center */}
          <path 
            d="M 245,150 
               C 230,110 215,80 185,60 
               C 215,75 240,95 250,150 
               Z" 
            fill="#3D230E" 
          />
          <path 
            d="M 255,150 
               C 270,110 285,80 315,60 
               C 285,75 260,95 250,150 
               Z" 
            fill="#3D230E" 
          />
          
          {/* Canopy Leaf Clusters */}
          {/* Top Left Center */}
          <g className="tree-leaf-cluster" style={{ transformOrigin: '190px 70px' }}>
            <circle cx="190" cy="70" r="42" fill="var(--color-green)" opacity="0.95" />
            <circle cx="170" cy="60" r="30" fill="#1C5E33" />
            <circle cx="205" cy="80" r="26" fill="var(--color-gold)" opacity="0.9" />
          </g>

          {/* Top Right Center */}
          <g className="tree-leaf-cluster tree-leaf-cluster-delay" style={{ transformOrigin: '310px 70px' }}>
            <circle cx="310" cy="70" r="42" fill="var(--color-green)" opacity="0.95" />
            <circle cx="330" cy="60" r="30" fill="var(--color-gold)" opacity="0.95" />
            <circle cx="295" cy="80" r="26" fill="#1B5E20" />
          </g>

          {/* Top Absolute Crown */}
          <g className="tree-leaf-cluster" style={{ transformOrigin: '250px 45px' }}>
            <circle cx="250" cy="45" r="48" fill="var(--color-green)" />
            <circle cx="250" cy="30" r="34" fill="#388E3C" />
            <circle cx="225" cy="50" r="28" fill="var(--color-gold)" opacity="0.85" />
            <circle cx="275" cy="50" r="28" fill="#1B5E20" />
          </g>
        </g>
      </svg>
    </div>
  );
}
