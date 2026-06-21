// Fetches published products from the Shopify public catalog REST endpoint.
// No authentication required — the /products.json endpoint is public for any
// published Shopify store. Cached 1 hour via Next.js ISR (revalidate: 3600).

const SHOP = 'shop.crocodilesaucefc.com';

type RawImage = { src: string; alt?: string };
type RawProduct = { title: string; handle: string; images: RawImage[] };

export type ShopProduct = {
  title: string;
  handle: string;
  url: string;
  image: string;
  imageAlt: string;
};

/**
 * Pick one image from positions [1, n-2]:
 *   skip [0]  → default front/swatch
 *   skip [-1] → size chart / spec sheet
 * Falls back to [0] when gallery is too small to slice.
 */
function pickImage(images: RawImage[]): RawImage {
  if (images.length === 0) return { src: '' };
  if (images.length <= 2) return images[0];
  const min = 1;
  const max = images.length - 2;
  const idx = min + Math.floor(Math.random() * (max - min + 1));
  return images[idx];
}

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const url = `https://${SHOP}/products.json?limit=250&fields=title,handle,images`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error(`[storefront] products.json ${res.status} ${res.statusText}`);
      return [];
    }

    const json = await res.json() as { products?: RawProduct[] };
    const products = json.products ?? [];

    if (products.length === 0) {
      console.error('[storefront] products.json returned 0 products');
      return [];
    }

    console.log(`[storefront] fetched ${products.length} products`);

    return products.map((p) => {
      const img = pickImage(p.images);
      return {
        title: p.title,
        handle: p.handle,
        url: `https://${SHOP}/products/${p.handle}`,
        image: img.src,
        imageAlt: img.alt ?? p.title,
      };
    });
  } catch (err) {
    console.error('[storefront] fetch failed:', err);
    return [];
  }
}
