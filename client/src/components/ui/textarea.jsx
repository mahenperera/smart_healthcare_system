import { cn } from "../../utils/cn";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300",
        className,
      )}
      {...props}
    />
  );
}
