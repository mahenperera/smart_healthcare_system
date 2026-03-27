import { cn } from "../../utils/cn";

const variants = {
  default: "bg-emerald-600 text-white hover:bg-emerald-700",
  outline: "border border-slate-200 bg-white hover:bg-slate-50",
  ghost: "hover:bg-slate-100",
  brand: "bg-brand-700 text-white hover:bg-brand-800",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-11 px-5 text-base rounded-xl",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
