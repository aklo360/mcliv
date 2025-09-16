"use client";

import { useCallback, useId, useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [toast, setToast] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputId = useId();

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();

    // Basic client-side validation (API validates too)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "OG" }),
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        const err = json?.error ? String(json.error) : "Subscription failed. Please try again.";
        throw new Error(err);
      }
      setStatus("success");
      setMessage("Thanks — you’re on the list.");
      form.reset();
      // Minimal toast
      setToast(true);
      setTimeout(() => setToast(false), 2400);
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong.");
    }
  }, []);

  const loading = status === "loading";
  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <div className="w-full flex flex-col items-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        aria-busy={loading}
        className="flex items-center justify-center gap-2"
      >
        <label htmlFor={inputId} className="sr-only">Email address</label>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          aria-invalid={isError || undefined}
          className="w-full max-w-sm md:max-w-md border border-black/15 rounded-md px-3 py-2 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-60"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 inline-flex items-center rounded-md border border-black/80 bg-black text-white px-4 py-2 text-sm hover:bg-white hover:text-black transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Joining…" : "Join List"}
        </button>
      </form>

      {/* Error message under the form (keep inline for feedback) */}
      {isError && (
        <p role="status" aria-live="polite" className="mt-2 text-xs text-center text-red-600">
          {message}
        </p>
      )}

      {/* Minimal success toast shown inline under the form */}
      <div
        aria-hidden
        className={`mt-2 flex justify-center pointer-events-none transition-opacity transition-transform duration-700 ease-in-out ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <div className="rounded-md bg-black text-white px-3 py-2 text-sm shadow-sm">
          Subscribed
        </div>
      </div>
    </div>
  );
}
