import Image from "next/image";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductByHandle, ShopifyProduct } from "@/lib/shopify";

const PRODUCT_HANDLE =
  process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE || "capsule-collection-001";

export const revalidate = 0;

export async function generateMetadata() {
  const product = await getProductSafely();

  return {
    title: product?.title
      ? `${product.title} · MCLIV Studio`
      : "MCLIV Studio · Edition",
    description: "Edition release now available from MCLIV Studio.",
  };
}

async function getProductSafely(): Promise<ShopifyProduct | null> {
  try {
    return await getProductByHandle(PRODUCT_HANDLE);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function LandingPage() {
  const product = await getProductSafely();
  const primaryVariant = product?.variants?.[0];
  const primaryImage = product?.images?.[0];
  const fallbackProductUrl = `https://studiomcliv.myshopify.com/products/${PRODUCT_HANDLE}`;

  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <section className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-6xl items-center justify-center px-6 pb-16 pt-28">
        {!product ? (
          <div className="mx-auto max-w-xl text-center">
            <h1 className="h2 mb-4">Product unavailable</h1>
            <p className="text-neutral-700">
              We could not load the release details. Please check your Shopify credentials and try again, or continue to the product page directly.
            </p>
            <a
              href={fallbackProductUrl}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white"
            >
              Open in Shopify
            </a>
          </div>
        ) : (
          <div className="grid w-full items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-black/5 bg-neutral-50 shadow-[0_25px_70px_-40px_rgba(0,0,0,0.4)]">
                {primaryImage && (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 90vw"
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {product.images.slice(1).map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-neutral-50"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || product.title}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Limited Release</p>
              <h1 className="h2">{product.title}</h1>
              <div
                className="space-y-4 text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />

              {primaryVariant && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">
                      {primaryVariant.price.currencyCode} {primaryVariant.price.amount}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      MCLIV / 1154 / No. 001
                    </span>
                  </div>

                  <AddToCartButton
                    variantId={primaryVariant.id}
                    disabled={!primaryVariant.availableForSale}
                  />
                  {!primaryVariant.availableForSale && (
                    <p className="text-xs text-red-600">Currently unavailable.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
