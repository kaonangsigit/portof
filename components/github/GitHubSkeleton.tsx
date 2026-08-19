export default function GitHubSkeleton() {
  return (
    <section className="py-20 sm:py-24 bg-[#020817]" aria-busy="true" aria-label="Loading GitHub data">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-56 bg-white/4 rounded-lg animate-pulse" />
          <div className="h-3.5 w-80 bg-white/3 rounded animate-pulse" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_,i) => (
            <div key={i} className="card-stat h-28 rounded-xl animate-pulse"
              style={{ animationDelay:`${i*0.08}s` }} />
          ))}
        </div>
        {/* Panel */}
        <div className="card-dark p-8 rounded-2xl space-y-4 animate-pulse">
          <div className="h-4 w-28 bg-white/5 rounded" />
          {[...Array(5)].map((_,i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 h-3 bg-white/5 rounded" />
              <div className="flex-1 h-2 bg-white/4 rounded-full" />
              <div className="w-6 h-3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
        {/* Contribution */}
        <div className="card-dark p-8 rounded-2xl animate-pulse">
          <div className="h-4 w-32 bg-white/5 rounded mb-6" />
          <div className="h-28 bg-white/3 rounded-lg" />
        </div>
        {/* Repos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="card-dark h-36 rounded-xl animate-pulse"
              style={{ animationDelay:`${i*0.07}s` }} />
          ))}
        </div>
      </div>
    </section>
  );
}
