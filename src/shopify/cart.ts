// Client-side winkelwagen via de Shopify Storefront Cart API. Dit
// bestand draait in de browser (geïmporteerd in <script>-tags), niet op
// build-time — cart-state bestaat alleen zolang de bezoeker 'm opbouwt.
// Geen eigen ordersysteem: cart.checkoutUrl leidt naar Shopify's eigen
// hosted checkout.
const domain = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
const token = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-10";
const CART_ID_KEY = "saveur-savoir-cart-id";

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  titel: string;
  prijs: string;
  afbeeldingUrl: string | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totaal: string;
  lines: CartLine[];
}

function formatPrijs(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: currencyCode }).format(
    Number.parseFloat(amount)
  );
}

// Andere onderdelen van de site (bv. het cart-icoon in Header.astro)
// luisteren hierop om het aantal live te verversen, zonder een
// framework/state-library nodig te hebben.
function meldCartWijziging(count: number) {
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count } }));
}

async function shopifyCartFetch(query: string, variables?: Record<string, unknown>): Promise<any | null> {
  try {
    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error("Shopify Cart API:", JSON.stringify(json.errors));
      return null;
    }
    return json.data;
  } catch (err) {
    console.error("Shopify Cart API onbereikbaar:", err);
    return null;
  }
}

const CART_FIELDS = `
  id
  checkoutUrl
  cost { totalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            product { title featuredImage { url } }
          }
        }
        cost { totalAmount { amount currencyCode } }
      }
    }
  }
`;

function naarCart(raw: any): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totaal: formatPrijs(raw.cost.totalAmount.amount, raw.cost.totalAmount.currencyCode),
    lines: raw.lines.edges.map((e: any) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandiseId: e.node.merchandise.id,
      titel: e.node.merchandise.product.title,
      prijs: formatPrijs(e.node.cost.totalAmount.amount, e.node.cost.totalAmount.currencyCode),
      afbeeldingUrl: e.node.merchandise.product.featuredImage?.url ?? null,
    })),
  };
}

async function maakNieuweCart(): Promise<string | null> {
  const data = await shopifyCartFetch(`mutation { cartCreate { cart { id } } }`);
  const id = data?.cartCreate?.cart?.id ?? null;
  if (id) localStorage.setItem(CART_ID_KEY, id);
  return id;
}

export async function getCart(): Promise<Cart | null> {
  const id = localStorage.getItem(CART_ID_KEY);
  if (!id) return null;

  const data = await shopifyCartFetch(`query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id });
  if (!data?.cart) {
    localStorage.removeItem(CART_ID_KEY);
    return null;
  }
  return naarCart(data.cart);
}

export async function addToCart(variantId: string, quantity: number): Promise<Cart | null> {
  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = await maakNieuweCart();
    if (!id) return null;
  }

  const ADD_MUTATION = `
    mutation AddLine($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }
  `;

  let data = await shopifyCartFetch(ADD_MUTATION, { cartId: id, lines: [{ merchandiseId: variantId, quantity }] });

  // De opgeslagen cart-ID kan verlopen zijn — probeer dan één keer opnieuw
  // met een verse cart, in plaats van de bezoeker een foutmelding te tonen.
  if (!data?.cartLinesAdd?.cart) {
    id = await maakNieuweCart();
    if (!id) return null;
    data = await shopifyCartFetch(ADD_MUTATION, { cartId: id, lines: [{ merchandiseId: variantId, quantity }] });
  }

  const cart = data?.cartLinesAdd?.cart ? naarCart(data.cartLinesAdd.cart) : null;
  if (cart) meldCartWijziging(cart.lines.reduce((n, l) => n + l.quantity, 0));
  return cart;
}

export async function updateLine(lineId: string, quantity: number): Promise<Cart | null> {
  const id = localStorage.getItem(CART_ID_KEY);
  if (!id) return null;

  const data = await shopifyCartFetch(
    `mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }`,
    { cartId: id, lines: [{ id: lineId, quantity }] }
  );

  const cart = data?.cartLinesUpdate?.cart ? naarCart(data.cartLinesUpdate.cart) : null;
  if (cart) meldCartWijziging(cart.lines.reduce((n, l) => n + l.quantity, 0));
  return cart;
}

export async function removeLine(lineId: string): Promise<Cart | null> {
  const id = localStorage.getItem(CART_ID_KEY);
  if (!id) return null;

  const data = await shopifyCartFetch(
    `mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
    }`,
    { cartId: id, lineIds: [lineId] }
  );

  const cart = data?.cartLinesRemove?.cart ? naarCart(data.cartLinesRemove.cart) : null;
  if (cart) meldCartWijziging(cart.lines.reduce((n, l) => n + l.quantity, 0));
  return cart;
}

// Alleen het aantal opvragen (voor het badge-icoon in Header.astro) zonder
// de volledige regelinformatie te hoeven ophalen.
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart?.lines.reduce((n, l) => n + l.quantity, 0) ?? 0;
}
