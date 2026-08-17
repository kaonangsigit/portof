export default function GitHubSkeleton() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-6" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
