export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => /^\+?[\d\s().-]{7,}$/.test(v.trim());

export type LoginValues = { email: string; password: string };
export type LoginErrors = Partial<Record<keyof LoginValues | "form", string>>;

export function validateLogin(v: LoginValues): LoginErrors {
  const e: LoginErrors = {};
  if (!v.email.trim()) e.email = "Enter your email.";
  else if (!isEmail(v.email)) e.email = "Enter a valid email address.";
  if (!v.password) e.password = "Enter your password.";
  return e;
}

export type RegisterValues = { name: string; email: string; phone: string; password: string };
export type RegisterErrors = Partial<Record<keyof RegisterValues | "form", string>>;

export function validateRegister(v: RegisterValues): RegisterErrors {
  const e: RegisterErrors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Enter your email.";
  else if (!isEmail(v.email)) e.email = "Enter a valid email address.";
  if (v.phone.trim() && !isPhone(v.phone)) e.phone = "Enter a valid phone number.";
  if (v.password.length < 8) e.password = "Use at least 8 characters.";
  return e;
}
