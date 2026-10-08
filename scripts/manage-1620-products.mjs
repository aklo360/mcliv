// Used only by an authenticated, expiring setup preview, never a production route.
// Product content, location and channel are fixed by the reviewed deployment.
const DOMAIN = 'g8x5xa-r0.myshopify.com';
const SHOP = 'gid://shopify/Shop/78018445562';
const LOCATION = 'gid://shopify/Location/85980545274';
const PUBLICATION = 'gid://shopify/Publication/178928746746';
const AUTOMATIC_CHANNELS = ['gid://shopify/Publication/193475576058', 'gid://shopify/Publication/219645935866'];
const FIELDS = `id handle title vendor status tags
  media(first: 2) { nodes { id mediaContentType status ... on MediaImage { image { url altText } } } }
  resourcePublications(first: 10) { nodes { publication { id name } isPublished } }
  variants(first: 2) { nodes { id price inventoryPolicy inventoryQuantity
    inventoryItem { id sku tracked requiresShipping inventoryLevels(first: 5) {
      nodes { location { id } quantities(names: ["available", "on_hand", "committed"]) { name quantity } }
    } }
  } }`;

export function createExhibitionSetup({products, keyHash, expires, shipping = {name: '1620 Artwork', flatRate: '75.00', weightPounds: 2, countries: ['US']}}) {
  if (products.length !== 18 || new Set(products.map((p) => p.handle)).size !== 18 ||
    products.some((p) => p.status !== 'DRAFT' || !p.handle.startsWith('1620-'))) {
    throw new Error('Invalid exhibition manifest');
  }
  const manifest = new Map(products.map((p) => [p.handle, p]));
  const json = (body, status = 200) => Response.json(body, {status, headers: {'Cache-Control': 'no-store'}});
  async function shopifyFetch(url, options) {
    const settings = {...options, redirect: 'manual'};
    let response = await fetch(url, settings);
    if ([301, 302, 307, 308].includes(response.status)) {
      const next = new URL(response.headers.get('location'), url);
      if (next.protocol !== 'https:' || ![DOMAIN, 'studiomcliv.myshopify.com'].includes(next.hostname) ||
        next.pathname !== new URL(url).pathname || next.port || next.username || next.password || next.search) {
        throw new Error('Unexpected Shopify redirect');
      }
      response = await fetch(next, settings);
    }
    return response;
  }
  async function graphql(env, query, variables = {}) {
    let response;
    try {
      response = await shopifyFetch(`https://${DOMAIN}/admin/api/2026-07/graphql.json`, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000),
        headers: {'Content-Type': 'application/json', 'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_TOKEN},
        body: JSON.stringify({query, variables}),
      });
    } catch { throw new Error('Shopify request failed; inspect before retrying.'); }
    if (!response.ok) throw new Error(`Shopify HTTP ${response.status}; no automatic retry.`);
    const result = await response.json();
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors.map(({message}) => message)));
    return result.data;
  }
  async function inspect(env, handle) {
    const result = await graphql(env, `query ExhibitionProduct($query: String!) {
      products(first: 2, query: $query) { nodes { ${FIELDS} } }
    }`, {query: `handle:${handle}`});
    return result.products.nodes.find((p) => p.handle === handle) ?? null;
  }
  function verify(actual, expected) {
    const variant = actual?.variants.nodes[0];
    if (!actual || actual.handle !== expected.handle || actual.title !== expected.title ||
      actual.vendor !== expected.vendor || !actual.tags.includes('1620') || actual.variants.nodes.length !== 1 ||
      Number(variant?.price) !== Number(expected.variants[0].price ?? 0) || variant?.inventoryPolicy !== 'DENY' ||
      !variant.inventoryItem.tracked || !variant.inventoryItem.requiresShipping ||
      variant.inventoryItem.sku !== expected.variants[0].inventoryItem.sku) {
      throw new Error('Product differs from the approved artwork; no overwrite.');
    }
    return variant;
  }
  function checkMutation(payload) {
    if (payload.userErrors?.length) throw new Error(JSON.stringify(payload.userErrors));
    return payload;
  }
  return async function handle(request, env) {
    if (request.method !== 'POST' || Date.now() > expires) return new Response('Not found', {status: 404});
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(request.headers.get('x-setup-key') ?? '')))).map((v) => v.toString(16).padStart(2, '0')).join('');
    if (digest !== keyHash) return new Response('Not found', {status: 404});
    try {
      const body = await request.json();
      if (Object.keys(body).some((k) => !['action', 'handle'].includes(k))) return json({error: 'Unexpected input'}, 400);
      const {action, handle: productHandle} = body;
      if (!['inspect', 'create', 'publish', 'unpublish', 'restrict', 'shipping', 'channels', 'storefront', 'media', 'scopes', 'weight', 'shipping-setup', 'price', 'stock-initial'].includes(action)) return json({error: 'Unknown action'}, 400);
      const expected = manifest.get(productHandle);
      if (!['shipping', 'channels', 'scopes', 'shipping-setup'].includes(action) && !expected) return json({error: 'Unknown artwork'}, 400);
      const account = await graphql(env, 'query VerifyShop { shop { id currencyCode } }');
      if (account.shop.id !== SHOP || account.shop.currencyCode !== 'USD') throw new Error('Wrong store or currency');
      if (action === 'scopes') return json(await graphql(env, 'query ExhibitionScopes { currentAppInstallation { accessScopes { handle } } }'));
      if (action === 'shipping-setup') {
        // One dedicated delivery profile for the exhibition: the reviewed location, a flat rate in the stated countries.
        const existing = await graphql(env, 'query ExhibitionProfiles { deliveryProfiles(first: 20) { nodes { id name } } }');
        const found = existing.deliveryProfiles.nodes.find((p) => p.name === shipping.name);
        if (found) return json({existing: true, profile: found});
        const listing = await graphql(env, `query ExhibitionVariants { products(first: 25, query: "tag:1620") { nodes { id handle variants(first: 1) { nodes { id } } } } }`);
        const nodes = listing.products.nodes.filter((p) => manifest.has(p.handle));
        if (nodes.length !== manifest.size) throw new Error(`Expected ${manifest.size} exhibition products, found ${nodes.length}`);
        const variantsToAssociate = nodes.map((p) => p.variants.nodes[0].id);
        const result = await graphql(env, `mutation CreateExhibitionShipping($profile: DeliveryProfileInput!) {
          deliveryProfileCreate(profile: $profile) { profile { id name } userErrors { field message } }
        }`, {profile: {name: shipping.name, variantsToAssociate, profileLocationGroups: [{locations: [LOCATION], zonesToCreate: [{
          name: 'Artwork shipping', countries: shipping.countries.map((code) => ({code})),
          methodDefinitionsToCreate: [{name: 'Artwork shipping', active: true, rateDefinition: {price: {amount: shipping.flatRate, currencyCode: 'USD'}}}],
        }]}]}});
        checkMutation(result.deliveryProfileCreate);
        return json({created: true, profile: result.deliveryProfileCreate.profile, variants: variantsToAssociate.length});
      }
      if (action === 'channels') return json(await graphql(env, `query ExhibitionChannels {
        nodes(ids: ["gid://shopify/Publication/193475576058", "gid://shopify/Publication/219645935866", "gid://shopify/Publication/178928746746"]) {
          ... on Publication { id name autoPublish app { id title } catalog { id title } }
        }
      }`));
      if (action === 'shipping') return json(await graphql(env, `query ExhibitionShipping {
        shopifyPaymentsAccount { activated }
        deliveryProfiles(first: 5) { nodes { id name default profileLocationGroups {
          locationGroup { locations(first: 5) { nodes { id name } } }
          locationGroupZones(first: 10) { nodes {
            zone { name countries { code { countryCode restOfWorld } } }
            methodDefinitions(first: 10) { nodes { name active
              methodConditions { field operator conditionCriteria { __typename ... on MoneyV2 { amount currencyCode } ... on Weight { value unit } } }
              rateProvider { __typename ... on DeliveryRateDefinition { price { amount currencyCode } } }
            } }
          } }
        } } }
      }`));
      if (action === 'storefront') {
        const headers = {'Content-Type': 'application/json'};
        if (env.PRIVATE_STOREFRONT_API_TOKEN) headers['Shopify-Storefront-Private-Token'] = env.PRIVATE_STOREFRONT_API_TOKEN;
        else headers['X-Shopify-Storefront-Access-Token'] = env.PUBLIC_STOREFRONT_API_TOKEN;
        const response = await shopifyFetch(`https://${DOMAIN}/api/2026-07/graphql.json`, {
          method: 'POST', redirect: 'error', headers, body: JSON.stringify({
            query: `query ExhibitionStorefront($handle: String!) @inContext(country: US) {
              shop { name } product(handle: $handle) { id handle title availableForSale
                variants(first: 2) { nodes { id availableForSale currentlyNotInStock price { amount currencyCode } } }
              }
            }`, variables: {handle: productHandle},
          }),
        });
        return json({http: response.status, result: await response.json()});
      }
      let product = await inspect(env, productHandle);
      if (action === 'inspect') return json({product});
      if (action === 'create') {
        if (product) { verify(product, expected); return json({existing: true, product}); }
        const input = structuredClone(expected);
        input.variants[0].inventoryQuantities = [{locationId: LOCATION, name: 'available', quantity: Number(input.variants[0].price) > 0 ? 1 : 0}];
        const result = await graphql(env, `mutation CreateExhibitionDraft($input: ProductSetInput!) {
          productSet(input: $input, synchronous: true) { product { ${FIELDS} } userErrors { field message code } }
        }`, {input});
        product = checkMutation(result.productSet).product;
        verify(product, expected);
        if (product.status !== 'DRAFT') throw new Error('Unexpected created product status');
        return json({created: true, product});
      }
      if (action === 'price') {
        // Bring the variant to the approved catalogue price before any other check compares them.
        const target = expected.variants[0].price;
        if (!target || Number(target) <= 0) throw new Error('No approved price for this work');
        const current = product.variants.nodes[0];
        if (Number(current.price) === Number(target)) return json({unchanged: true, price: current.price});
        const result = await graphql(env, `mutation SetExhibitionPrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) { productVariants { id price } userErrors { field message } }
        }`, {productId: product.id, variants: [{id: current.id, price: target}]});
        checkMutation(result.productVariantsBulkUpdate);
        return json({price: result.productVariantsBulkUpdate.productVariants[0].price, previous: current.price});
      }
      const variant = verify(product, expected);
      if (action === 'stock-initial') {
        // First stocking only: one original, never a restock. Refused once the work has ever been published or held stock.
        const levels = variant.inventoryItem.inventoryLevels.nodes;
        const onHand = levels.reduce((sum, l) => sum + (l.quantities.find((q) => q.name === 'on_hand')?.quantity ?? 0), 0);
        const everPublished = product.resourcePublications.nodes.some((p) => p.isPublished);
        if (onHand !== 0 || everPublished || product.status !== 'DRAFT') return json({skipped: true, onHand, everPublished, status: product.status});
        // Deterministic idempotency key: a retry can never stock the same original twice.
        const result = await graphql(env, `mutation StockExhibitionOriginal($input: InventoryAdjustQuantitiesInput!) {
          inventoryAdjustQuantities(input: $input) @idempotent(key: "1620-initial-stock-${productHandle}") { inventoryAdjustmentGroup { changes { name delta } } userErrors { field message } }
        }`, {input: {name: 'available', reason: 'correction', changes: [{inventoryItemId: variant.inventoryItem.id, locationId: LOCATION, delta: 1, changeFromQuantity: 0}]}});
        checkMutation(result.inventoryAdjustQuantities);
        return json({stocked: true, product: await inspect(env, productHandle)});
      }
      if (action === 'weight') {
        const result = await graphql(env, `mutation SetExhibitionWeight($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) { productVariants { id inventoryItem { measurement { weight { value unit } } } } userErrors { field message } }
        }`, {productId: product.id, variants: [{id: variant.id, inventoryItem: {measurement: {weight: {value: shipping.weightPounds, unit: 'POUNDS'}}}}]});
        checkMutation(result.productVariantsBulkUpdate);
        return json({weight: result.productVariantsBulkUpdate.productVariants[0].inventoryItem.measurement.weight});
      }
      if (action === 'media') {
        // Replace the artwork photograph with the reviewed source, keeping exactly one image.
        const source = expected.files?.[0];
        if (!source?.originalSource) throw new Error('No reviewed artwork image for this product');
        const wanted = new URL(source.originalSource).pathname.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
        const current = product.media.nodes;
        if (current.length === 1 && current[0].status === 'READY' && current[0].image?.url?.includes(wanted)) {
          return json({unchanged: true, product});
        }
        const created = await graphql(env, `mutation AddExhibitionImage($productId: ID!, $media: [CreateMediaInput!]!) {
          productCreateMedia(productId: $productId, media: $media) { media { id status } mediaUserErrors { field message code } }
        }`, {productId: product.id, media: [{originalSource: source.originalSource, mediaContentType: 'IMAGE', alt: source.alt}]});
        if (created.productCreateMedia.mediaUserErrors?.length) throw new Error(JSON.stringify(created.productCreateMedia.mediaUserErrors));
        const newId = created.productCreateMedia.media[0].id;
        let ready = false;
        for (let attempt = 0; attempt < 12 && !ready; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 2500));
          const fresh = await inspect(env, productHandle);
          const node = fresh.media.nodes.find((m) => m.id === newId);
          if (node?.status === 'FAILED') throw new Error('Shopify could not process the artwork image');
          ready = node?.status === 'READY';
        }
        if (!ready) return json({error: 'Image still processing; inspect before retrying', mediaId: newId}, 409);
        const stale = current.map((m) => m.id).filter((id) => id !== newId);
        if (stale.length) {
          const removed = await graphql(env, `mutation RemoveExhibitionImages($productId: ID!, $mediaIds: [ID!]!) {
            productDeleteMedia(productId: $productId, mediaIds: $mediaIds) { deletedMediaIds mediaUserErrors { field message } }
          }`, {productId: product.id, mediaIds: stale});
          if (removed.productDeleteMedia.mediaUserErrors?.length) throw new Error(JSON.stringify(removed.productDeleteMedia.mediaUserErrors));
        }
        const final = await inspect(env, productHandle);
        if (final.media.nodes.length !== 1 || final.media.nodes[0].id !== newId) throw new Error('Unexpected media state after replacement');
        return json({replaced: stale, product: final});
      }
      async function restrictChannels() {
        const current = await inspect(env, productHandle);
        const extra = current.resourcePublications.nodes.filter((p) => p.isPublished && AUTOMATIC_CHANNELS.includes(p.publication.id));
        for (const channel of extra) {
          const result = await graphql(env, `mutation LimitExhibitionChannels($id: ID!, $input: PublicationUpdateInput!) {
            publicationUpdate(id: $id, input: $input) { userErrors { field message } }
          }`, {id: channel.publication.id, input: {publishablesToRemove: [product.id]}});
          checkMutation(result.publicationUpdate);
        }
      }
      if (action === 'restrict') {
        await restrictChannels();
        return json({product: await inspect(env, productHandle)});
      }
      if (action === 'unpublish') {
        const result = await graphql(env, `mutation PauseExhibition($id: ID!, $input: [PublicationInput!]!) {
          publishableUnpublish(id: $id, input: $input) { userErrors { field message } }
        }`, {id: product.id, input: [{publicationId: PUBLICATION}]});
        checkMutation(result.publishableUnpublish);
        return json({product: await inspect(env, productHandle)});
      }
      if (!expected.variants[0].price || Number(expected.variants[0].price) <= 0) throw new Error('Price is pending; cannot publish');
      if (!['DRAFT', 'ACTIVE'].includes(product.status)) throw new Error('Product status requires review');
      const levels = variant.inventoryItem.inventoryLevels.nodes;
      const stock = levels.find((l) => l.location.id === LOCATION);
      if (variant.inventoryQuantity !== 1 || !stock || stock.quantities.find((q) => q.name === 'available')?.quantity !== 1 ||
        stock.quantities.find((q) => q.name === 'on_hand')?.quantity !== 1 || stock.quantities.find((q) => q.name === 'committed')?.quantity !== 0 ||
        levels.some((l) => l.location.id !== LOCATION && l.quantities.some((q) => q.quantity !== 0))) {
        throw new Error('Inventory must be exactly one original at the reviewed location; no restocking');
      }
      if (expected.files?.length && (product.media.nodes.length !== 1 || product.media.nodes[0].status !== 'READY')) {
        throw new Error('Artwork image is not ready');
      }
      if (product.status !== 'ACTIVE') {
        const result = await graphql(env, `mutation ActivateExhibition($product: ProductUpdateInput!) {
          productUpdate(product: $product) { product { id status } userErrors { field message } }
        }`, {product: {id: product.id, status: 'ACTIVE'}});
        checkMutation(result.productUpdate);
      }
      await restrictChannels();
      if (!product.resourcePublications.nodes.some((p) => p.publication.id === PUBLICATION && p.isPublished)) {
        const result = await graphql(env, `mutation PublishExhibition($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) { userErrors { field message } }
        }`, {id: product.id, input: [{publicationId: PUBLICATION}]});
        checkMutation(result.publishablePublish);
      }
      return json({product: await inspect(env, productHandle)});
    } catch (error) { return json({error: error.message}, 409); }
  };
}
