import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8" aria-busy="true">
      <div className="flex flex-col items-center gap-2 text-center">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-64 w-full max-w-md rounded-xl" />
    </div>
  );
}