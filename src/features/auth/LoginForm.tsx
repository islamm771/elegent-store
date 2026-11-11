"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, Button, Checkbox, Divider, LockIcon, MailIcon, ShieldIcon, TextField } from "@/ui";
import { validateLogin, type LoginErrors } from "@/lib/validation";
import { SocialAuth, type SocialProvider } from "./SocialAuth";

export function LoginForm({ providers = [], callbackUrl = "/" }: { providers?: SocialProvider[]; callbackUrl?: string }) {
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email.trim(),
        password: values.password,
        remember: String(remember), // read it in authorize()/jwt() to pick the 30-day maxAge
        redirect: false,
      });
      if (!res || res.error) return setErrors({ form: "Incorrect email or password." });
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:gap-6">
        {errors.form && (
          <p role="alert" className="rounded-field bg-danger/10 px-3 py-2 text-[13px] text-danger">{errors.form}</p>
        )}

        <TextField label="Email" type="email" name="email" autoComplete="email" placeholder="curator@elegent.com"
          value={values.email} onChange={set("email")} error={errors.email}
          leading={<MailIcon />} />

        <TextField label="Password" type="password" name="password" autoComplete="current-password" placeholder="••••••••••••"
          value={values.password} onChange={set("password")} error={errors.password}
          leading={<LockIcon />}
          aside={<Link href="/forgot-password" className="label-caps text-accent underline-offset-2 hover:underline">Forgot password?</Link>} />

        <div className="flex items-center justify-between">
          <Checkbox name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="items-center text-ink">
            Remember for 30 days
          </Checkbox>
          <span className="eyebrow flex items-center gap-1.5 text-accent"><ShieldIcon width={12} height={12} /> Encrypted</span>
        </div>

        <Button type="submit" loading={loading} rightIcon={<ArrowRightIcon width={12} height={12} />}>Sign in</Button>
      </form>

      {providers.length > 0 && (
        <>
          <Divider>Or continue with</Divider>
          <SocialAuth providers={providers} callbackUrl={callbackUrl} />
        </>
      )}
    </div>
  );
}
