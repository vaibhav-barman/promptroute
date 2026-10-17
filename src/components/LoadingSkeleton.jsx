export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Hero skeleton */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full shimmer-bg" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-64 rounded-lg shimmer-bg" />
            <div className="h-4 w-48 rounded-md shimmer-bg" />
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="h-8 w-24 rounded-full shimmer-bg" />
          <div className="h-8 w-32 rounded-full shimmer-bg" />
          <div className="h-8 w-28 rounded-full shimmer-bg" />
        </div>
      </div>

      {/* Budget skeleton */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded shimmer-bg" />
          <div className="h-8 w-36 rounded-lg shimmer-bg" />
        </div>
        <div className="h-10 w-24 rounded-xl shimmer-bg" />
      </div>

      {/* Day cards skeleton */}
      {[1, 2, 3].map((day) => (
        <div key={day} className="space-y-3">
          {/* Day header */}
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 rounded-full shimmer-bg" />
            <div className="h-5 w-40 rounded shimmer-bg" />
          </div>

          {/* Activity cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
            {[1, 2, 3, 4].map((activity) => (
              <div key={activity} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 rounded shimmer-bg" />
                  <div className="h-5 w-16 rounded-full shimmer-bg" />
                </div>
                <div className="h-4 w-full rounded shimmer-bg" />
                <div className="h-4 w-3/4 rounded shimmer-bg" />
                <div className="flex items-center justify-between mt-1">
                  <div className="h-4 w-20 rounded shimmer-bg" />
                  <div className="h-4 w-16 rounded shimmer-bg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pulsing text */}
      <div className="text-center py-4">
        <p className="text-sm text-white/30 animate-pulse-soft font-mono">
          ✦ AI is crafting your perfect itinerary — this may take 15–30 seconds ✦
        </p>
      </div>
    </div>
  );
}
