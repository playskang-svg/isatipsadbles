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

/** 자격증명이 런타임에 주입됐는지만 확인한다. 값은 절대 반환하지 않는다. */
export function hasCoupangCredentials() {
  return Boolean(process.env.COUPANG_ACCESS_KEY && process.env.COUPANG_SECRET_KEY);
}

export class CoupangCredentialsMissingError extends Error {
  constructor() {
    super("Coupang API credentials are not configured.");
    this.name = "CoupangCredentialsMissingError";
  }
}

/** subId는 쿠팡 파트너스 성과 분석용 태그다. 영숫자·하이픈만 허용된다. */
function toSubId(value?: string) {
  if (!value) return undefined;
  const cleaned = value.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 50);
  return cleaned || undefined;
}

export async function searchCoupangProduct(keyword: string, subId?: string): Promise<CoupangProduct | null> {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) throw new CoupangCredentialsMissingError();

  const params: Record<string, string> = { keyword, limit: "3" };
  const tag = toSubId(subId);
  if (tag) params.subId = tag;
  const query = new URLSearchParams(params).toString();
  const authorization = await createAuthorization("GET", SEARCH_PATH, query, accessKey, secretKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(`${API_HOST}${SEARCH_PATH}?${query}`, {
      headers: { Authorization: authorization, "Content-Type": "application/json;charset=UTF-8" },
      signal: controller.signal,
    });
    if (!response.ok) {
      // 401/403은 키 문제, 429는 호출 한도. 재시도는 호출부가 판단한다(무한 재시도 금지).
      const detail = response.status === 401 || response.status === 403
        ? "인증 실패 — 키가 올바른지 확인하세요."
        : response.status === 429
          ? "호출 한도 초과."
          : "";
      throw new Error(`Coupang API request failed with status ${response.status}. ${detail}`.trim());
    }

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
