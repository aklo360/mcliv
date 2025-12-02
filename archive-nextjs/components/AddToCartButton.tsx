"use client";

import { useState } from "react";

type Props = {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
};

export default function AddToCartButton({ variantId, quantity = 1, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled) return;
    try {
      setLoading(true);
      const res = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });

      const data = await res.json();
      if (!res.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || "Unable to start checkout");
      }

      window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error(e);
      alert("Unable to open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70"
      aria-busy={loading}
    >
      {loading ? "Opening checkout..." : "Buy now"}
    </button>
  );
}
