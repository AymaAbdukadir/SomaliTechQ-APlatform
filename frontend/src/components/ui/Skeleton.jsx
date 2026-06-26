export function QuestionCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="hidden shrink-0 flex-col gap-2 sm:flex">
          <div className="h-10 w-14 shimmer rounded" />
          <div className="h-10 w-14 shimmer rounded" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-3/4 shimmer rounded" />
          <div className="h-4 w-full shimmer rounded" />
          <div className="h-4 w-2/3 shimmer rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 shimmer rounded-full" />
            <div className="h-6 w-16 shimmer rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 shimmer rounded-full" />
            <div className="h-4 w-32 shimmer rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex gap-4">
          <div className="h-20 w-12 shimmer rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-2/3 shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex gap-4">
            <div className="h-16 w-10 shimmer rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full shimmer rounded" />
              <div className="h-4 w-3/4 shimmer rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
