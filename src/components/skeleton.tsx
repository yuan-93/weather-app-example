import clsx from "clsx";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "w-full h-20" }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-neutral-500/80 dark:bg-white/20",
        className
      )}
    ></div>
  );
}
