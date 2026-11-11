"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { ArrowRightIcon, Button, Checkbox, Divider, MailIcon, PhoneIcon, StrengthMeter, TextField, UserIcon } from "@/ui";
import { passwordStrength } from "@/lib/password";
import { validateRegister, type RegisterErrors } from "@/lib/validation";
import { SocialAuth, type SocialProvider } from "./SocialAuth";

const link = "text-ink underline decoration-accent underline-offset-2";
const tag = "text-[11px] font-semibold text-accent";

export function RegisterForm({ providers = [] }: { providers?: SocialProvider[] }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });
  const [newsletter, setNewsletter] = useState(true);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateRegister(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, email: values.email.trim(), name: values.name.trim(), newsletter }),
      });
      if (res.status === 409) return setErrors({ email: "An account with this email already exists." });
      if (!res.ok) return setErrors({ form: "Could not create your account. Please try again." });
      toast.success("Account created. Please sign in.");
      router.push("/login");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const strength = passwordStrength(values.password).label;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 lg:gap-6">
      {errors.form && <p role="alert" className="rounded-field bg-danger/10 px-3 py-2 text-[13px] text-danger">{errors.form}</p>}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-5 lg:gap-y-6">
        <TextField label="Full name" name="name" autoComplete="name" placeholder="Eleanor Vance"
          value={values.name} onChange={set("name")} error={errors.name}
          aside={<span className={`${tag} lowercase lg:hidden`}>required</span>} trailing={<UserIcon width={14} height={14} />} />

        <TextField label="Email address" type="email" name="email" autoComplete="email" placeholder="vance@atelier-couture.com"
          value={values.email} onChange={set("email")} error={errors.email}
          aside={<span className={`${tag} lowercase lg:hidden`}>required</span>} trailing={<MailIcon width={14} height={14} />} />

        <TextField label="Phone number" type="tel" name="phone" autoComplete="tel" placeholder="+1 (555) 019-2834"
          value={values.phone} onChange={set("phone")} error={errors.phone}
          aside={<span className="text-[11px] font-semibold lowercase text-ink-subtle lg:uppercase lg:tracking-[0.1em]">optional</span>}
          trailing={<PhoneIcon width={14} height={14} />} />

        <div>
          <TextField label="Password" type="password" name="password" autoComplete="new-password" placeholder="••••••••••••"
            value={values.password} onChange={set("password")} error={errors.password}
            aside={
              <>
                <span className={`${tag} lowercase lg:hidden`}>min. 8 characters</span>
                <span className={`${tag} hidden uppercase lg:inline`}>{strength}</span>
              </>
            } />
          <StrengthMeter password={values.password} />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Checkbox name="newsletter" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)}>
          Subscribe to curated editorial drops, private runway invites, and seasonal sales.
        </Checkbox>
        <p className="text-[13px] leading-[21px] text-ink-subtle lg:bg-surface lg:p-3.5 lg:text-ink-muted/80">
          By selecting <span className="lg:font-semibold lg:text-ink">Create Account</span>, you acknowledge agreement with our{" "}
          <Link href="/terms" className={link}>Terms of Service</Link> and{" "}
          <Link href="/privacy" className={link}>Privacy Policy</Link>.
        </p>
      </div>

      <Button type="submit" loading={loading} className="mt-2 lg:mt-0" rightIcon={<ArrowRightIcon width={11} height={11} />}>
        Create account
      </Button>

      {providers.length > 0 && (
        <div className="flex flex-col gap-4 pt-2">
          <Divider>Or register with</Divider>
          <SocialAuth providers={providers} />
        </div>
      )}
    </form>
  );
}
