export default function ContributionGraph({ username }: { username: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Contribution Graph
      </h3>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/${username}`}
        alt={`GitHub contribution chart for ${username}`}
        className="w-full rounded"
        loading="lazy"
      />
    </div>
  );
}
