"use client";

interface VibeScoreProps {
  scores: {
    overall: number;
    walkability: number;
    greenSpace: number;
    nightlife: number;
    familyFriendliness: number;
  };
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 70) return "bg-primary";
    if (s >= 40) return "bg-amber-400";
    return "bg-red-400";
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted">{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function VibeScore({ scores }: VibeScoreProps) {
  return (
    <div>
      {/* Overall Score */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
          <span className="text-3xl font-heading font-bold text-white">
            {scores.overall}
          </span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg">Vibe Score</h3>
          <p className="text-sm text-muted">
            {scores.overall >= 70
              ? "Great neighbourhood vibes!"
              : scores.overall >= 40
              ? "Decent area with some trade-offs"
              : "This area may have some drawbacks"}
          </p>
        </div>
      </div>

      {/* Individual scores */}
      <div className="space-y-4">
        <ScoreBar label="Walkability" score={scores.walkability} />
        <ScoreBar label="Green Space" score={scores.greenSpace} />
        <ScoreBar label="Nightlife & Dining" score={scores.nightlife} />
        <ScoreBar label="Family Friendliness" score={scores.familyFriendliness} />
      </div>
    </div>
  );
}
