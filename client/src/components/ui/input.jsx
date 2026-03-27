import { cn } from "../../utils/cn";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none",
        "focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300",
        className,
      )}
      {...props}
    />
  );
}
