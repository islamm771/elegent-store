"use client";
import { cn } from "@/lib/cn";
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leading, trailing, invalid, className, ...rest }, ref,
) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-field bg-field px-4 transition-shadow",
      "focus-within:ring-1 focus-within:ring-accent",
      invalid && "ring-1 ring-danger focus-within:ring-danger",
    )}>
      {leading && <span className="shrink-0 text-ink-subtle">{leading}</span>}
      <input ref={ref} aria-invalid={invalid || undefined}
        className={cn("min-w-0 flex-1 bg-transparent py-3 text-[15px] text-ink outline-none placeholder:text-ink-faint lg:py-3.5", className)}
        {...rest} />
      {trailing && <span className="shrink-0 text-ink-subtle">{trailing}</span>}
    </div>
  );
});

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type" | "trailing">>(
  function PasswordInput(props, ref) {
    const [show, setShow] = useState(false);
    return (
      <Input ref={ref} {...props} type={show ? "text" : "password"}
        trailing={
          <button type="button" onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}
            className="-mr-1 rounded-field p-1 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent">
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        } />
    );
  },
);

export interface TextFieldProps extends InputProps {
  label: string;
  aside?: ReactNode;   // small text on the right of the label: "required", "optional", "Forgot password?"
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, aside, error, id, type = "text", ...input }, ref,
) {
  const uid = useId();
  const fid = id ?? uid;
  const common = { id: fid, invalid: !!error, "aria-describedby": error ? `${fid}-error` : undefined };
  return (
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={fid} className="label-caps text-ink-muted lg:text-[13px] lg:leading-4 lg:tracking-wider lg:text-ink">{label}</label>
        {aside}
      </div>
      {type === "password"
        ? <PasswordInput ref={ref} {...common} {...input} />
        : <Input ref={ref} type={type} {...common} {...input} />}
      {error && <p id={`${fid}-error`} role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  );
});
