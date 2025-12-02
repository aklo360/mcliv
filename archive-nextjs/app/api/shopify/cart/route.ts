import { NextRequest, NextResponse } from "next/server";
import { createCartWithLines, variantGidToId } from "@/lib/shopify";

export async function POST(req: NextRequest) {
  try {
    const { variantId, quantity = 1 } = await req.json();

    if (!variantId || typeof variantId !== "string") {
      return NextResponse.json({ ok: false, error: "variantId is required" }, { status: 400 });
    }

    const qty = Number(quantity) || 1;
    const cart = await createCartWithLines([{ variantId, quantity: qty }]);

    return NextResponse.json({
      ok: true,
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
      variantNumericId: variantGidToId(variantId),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || String(e) }, { status: 500 });
  }
}
