interface Language {
  language: string;
  count: number;
}

export default function LanguageChart({ languages }: { languages: Language[] }) {
  if (!languages.length) return null;
  const max = Math.max(...languages.map((l) => l.count), 1);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Languages</h3>
      <div className="space-y-3">
        {languages.map(({ language, count }) => (
          <div key={language} className="flex items-center gap-3">
            <span className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate shrink-0">
              {language}
            </span>
            <div
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2"
              role="progressbar"
              aria-valuenow={count}
              aria-valuemax={max}
              aria-label={`${language}: ${count} repos`}
            >
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="w-6 text-xs text-gray-400 text-right shrink-0">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
