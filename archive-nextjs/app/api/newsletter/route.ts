// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const ADMIN_TOKEN  = process.env.SHOPIFY_ADMIN_TOKEN!;
const API_VERSION  = process.env.SHOPIFY_API_VERSION || "2025-07";

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.warn(
    "[newsletter] Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN. " +
    "Set them in .env.local"
  );
}

const ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

async function gql<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

  const reqInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN ?? "",
    },
    body: JSON.stringify({ query, variables }),
    redirect: "manual", // don't auto-convert POST→GET
    cache: "no-store",
  };

  // First request (Shopify may 301 to a pod domain)
  let res = await fetch(ENDPOINT, reqInit);

  // Manually follow one hop and re-POST the same body
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location");
    if (!loc) {
      const body = await res.text().catch(() => "");
      throw new Error(`Shopify redirected without Location header (status ${res.status}). Body: ${body.slice(0,300)}`);
    }
    res = await fetch(loc, {
      method: "POST",
      headers: reqInit.headers,
      body: reqInit.body as BodyInit,
      cache: "no-store",
    });
  }

  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch (e) {
    throw new Error(`Shopify ${res.status} non-JSON response: ${text.slice(0,500)}`);
  }

  if (!res.ok || json.errors) {
    throw new Error(`Shopify ${res.status} GraphQL error: ${JSON.stringify(json.errors || json, null, 2)}`);
  }

  return json.data as T;
}

const UPSERT = /* GraphQL */ `
  mutation upsertCustomer($input: CustomerSetInput!, $ident: CustomerSetIdentifiers) {
    customerSet(input: $input, identifier: $ident) {
      customer { id }             # no email, avoid PII reads
      userErrors { field message } # keep it simple; type supports code but not required
    }
  }
`;

const UPDATE_CONSENT = /* GraphQL */ `
  mutation updateConsent($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer { id }              # do not select email
      userErrors { field message }
    }
  }
`;

const TAGS_ADD = /* GraphQL */ `
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors { message }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const { email, tag = "newsletter" } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const consent = {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
      consentUpdatedAt: new Date().toISOString(),
    };

    // 1) Upsert the customer by email (works without reading PII)
    const up = await gql(UPSERT, {
      ident: { email },
      input: { email },
    });

    const upErrors = up?.customerSet?.userErrors;
    if (upErrors?.length) {
      return NextResponse.json({ ok: false, error: upErrors }, { status: 400 });
    }

    const customerId = up?.customerSet?.customer?.id;
    if (!customerId) {
      return NextResponse.json({ ok: false, error: "No customer id returned" }, { status: 500 });
    }

    // 2) Set single opt-in consent
    const upd = await gql(UPDATE_CONSENT, {
      input: { customerId, emailMarketingConsent: consent },
    });
    const updErrors = upd?.customerEmailMarketingConsentUpdate?.userErrors;
    if (updErrors?.length) {
      return NextResponse.json({ ok: false, error: updErrors }, { status: 400 });
    }

    // 3) Add tag
    await gql(TAGS_ADD, { id: customerId, tags: [tag] });

    // We cannot reliably tell "created" vs "updated" without reading PII
    return NextResponse.json({ ok: true, status: "upserted" });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || String(e) }, { status: 500 });
  }
}
