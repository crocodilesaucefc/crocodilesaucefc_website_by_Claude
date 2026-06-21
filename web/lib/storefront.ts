// Server-side only — uses Admin API with X-Shopify-Access-Token.
// Env var: SHOPIFY_ADMIN_TOKEN (Admin API access token from the custom app's credential page).
// Never exposed to the client; fetch is cached 1 hour via Next.js ISR.

const SHOP = 'shop.crocodilesaucefc.com';
const API_VERSION = '2025-01';

const PRODUCTS_QUERY = `{
  products(first: 50, sortKey: TITLE) {
    nodes {
      title
      handle
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
    }
  }
}`;

type RawImage = { url: string; altText: string | null };
type RawProduct = { title: string; handle: string; images: { nodes: RawImage[] } };

export type ShopProduct = {
  title: string;
  handle: string;
  url: string;
  image: string;
  imageAlt: string;
};

/**
 * Pick one image from positions 2–(n-1): never image 0 (default/swatch)
 * or the last image (spec/measurement sheet).
 */
function pickImage(nodes: RawImage[]): RawImage {
  if (nodes.length === 0) return { url: '', altText: null };
  if (nodes.length <= 2) return nodes[0];
  const min = 1;
  const max = nodes.length - 2;
  const idx = min + Math.floor(Math.random() * (max - min + 1));
  return nodes[idx];
}

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY }),
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return [];

    const json = await res.json() as { data?: { products?: { nodes: RawProduct[] } } };
    const nodes = json.data?.products?.nodes ?? [];

    return nodes.map((p) => {
      const img = pickImage(p.images.nodes);
      return {
        title: p.title,
        handle: p.handle,
        url: `https://shop.crocodilesaucefc.com/products/${p.handle}`,
        image: img.url,
        imageAlt: img.altText ?? p.title,
      };
    });
  } catch {
    return [];
  }
}
