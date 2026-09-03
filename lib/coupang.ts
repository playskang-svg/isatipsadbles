type CoupangApiProduct = {
  productId?: number | string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  productUrl?: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
};

export type CoupangProduct = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string | null;
  productUrl: string;
  isRocket: boolean;
  isFreeShipping: boolean;
};

const API_HOST = "https://api-gateway.coupang.com";
const SEARCH_PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/search";

function signedDate() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "").slice(2);
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function createAuthorization(method: string, path: string, query: string, accessKey: string, secretKey: string) {
  const datetime = signedDate();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${datetime}${method}${path}${query}`));

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${toHex(signature)}`;
}

function isAllowedProductUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "coupang.com" || url.hostname.endsWith(".coupang.com") || url.hostname === "coupa.ng");
  } catch {
    return false;
  }
}

function safeImageUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function searchCoupangProduct(keyword: string): Promise<CoupangProduct | null> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) throw new Error("Coupang API credentials are not configured.");

  const query = new URLSearchParams({ keyword, limit: "3" }).toString();
  const authorization = await createAuthorization("GET", SEARCH_PATH, query, accessKey, secretKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(`${API_HOST}${SEARCH_PATH}?${query}`, {
      headers: { Authorization: authorization, "Content-Type": "application/json;charset=UTF-8" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Coupang API request failed with status ${response.status}.`);

    const payload = await response.json() as {
      rCode?: string;
      rMessage?: string;
      data?: { productData?: CoupangApiProduct[] } | CoupangApiProduct[];
    };
    const products = Array.isArray(payload.data) ? payload.data : payload.data?.productData;
    const product = products?.find((item) => item.productName && item.productUrl && isAllowedProductUrl(item.productUrl));
    if (!product || !product.productName || !product.productUrl) return null;

    return {
      id: String(product.productId ?? product.productUrl),
      name: product.productName,
      price: typeof product.productPrice === "number" ? product.productPrice : null,
      imageUrl: safeImageUrl(product.productImage),
      productUrl: product.productUrl,
      isRocket: Boolean(product.isRocket),
      isFreeShipping: Boolean(product.isFreeShipping),
    };
  } finally {
    clearTimeout(timeout);
  }
}
