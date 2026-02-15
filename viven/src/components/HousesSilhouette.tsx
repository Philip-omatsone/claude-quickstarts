"use client";

export function HousesSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-full"
        style={{
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full text-gray-300"
          preserveAspectRatio="none"
          style={{ height: "250px" }}
        >
          <path
            fill="currentColor"
            d="M0,320 L0,200 L30,200 L30,160 L50,120 L70,160 L70,200 L100,200 L100,140 L120,100 L140,140 L140,200 L160,200 L160,180 L180,180 L180,120 L200,80 L220,120 L220,180 L240,180 L240,200 L280,200 L280,160 L300,130 L320,160 L320,200 L350,200 L350,170 L370,170 L370,110 L390,70 L410,110 L410,170 L430,170 L430,200 L460,200 L460,150 L480,110 L500,150 L500,200 L540,200 L540,190 L560,190 L560,130 L580,90 L600,130 L600,190 L620,190 L620,200 L660,200 L660,160 L680,120 L700,160 L700,200 L740,200 L740,140 L760,100 L780,140 L780,200 L810,200 L810,170 L830,130 L850,170 L850,200 L890,200 L890,180 L910,180 L910,110 L930,75 L950,110 L950,180 L970,180 L970,200 L1010,200 L1010,155 L1030,115 L1050,155 L1050,200 L1090,200 L1090,170 L1110,130 L1130,170 L1130,200 L1170,200 L1170,145 L1190,105 L1210,145 L1210,200 L1250,200 L1250,175 L1270,135 L1290,175 L1290,200 L1320,200 L1320,160 L1340,120 L1360,160 L1360,200 L1400,200 L1400,185 L1420,145 L1440,185 L1440,320 Z"
          />
          {/* Windows */}
          {[55, 125, 195, 305, 395, 485, 585, 685, 765, 835, 935, 1035, 1115, 1195, 1275, 1345, 1425].map(
            (x, i) => (
              <rect
                key={i}
                x={x - 5}
                y={140 + (i % 3) * 15}
                width="10"
                height="12"
                rx="1"
                fill="#FAFAF8"
                opacity="0.6"
              />
            )
          )}
        </svg>
      </div>
    </div>
  );
}
