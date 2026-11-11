"use client";
import toast from "react-hot-toast";

export async function shareProduct(title: string) {
  const url = window.location.href;
  try {
    if (navigator.share) { await navigator.share({ title, url }); return; }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  } catch { /* user dismissed the share sheet */ }
}
