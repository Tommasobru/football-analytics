export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
