# Hydrogen upgrade guide: 2025.7.0 to 2026.1.0

----

## Features

### Migrate to Shopify's new cookie system [#3309](https://github.com/Shopify/hydrogen/pull/3309)

#### Step: 1. Understand the new cookie model and compatibility story [#3309](https://github.com/Shopify/hydrogen/pull/3309)

> Shopify is deprecating `_shopify_y` and `_shopify_s` in favor of `_shopify_analytics` and `_shopify_marketing`, which are http-only cookies set via the Storefront API on your storefront domain. Hydrogen now reads and writes these cookies through a Storefront API proxy while still honoring the legacy cookies when present. You don't need to migrate values manually, but you must ensure that requests flow through the proxy so cookies are set before analytics run.
[#3309](https://github.com/Shopify/hydrogen/pull/3309)

#### Step: 2. Set up a Storefront API proxy for your deployment [#3309](https://github.com/Shopify/hydrogen/pull/3309)

> Depending on how you host your app, you must ensure Storefront API calls go through a proxy on your storefront domain.
[#3309](https://github.com/Shopify/hydrogen/pull/3309)
### React Router + Hydrogen on Oxygen

If you scaffolded from the default Hydrogen skeleton and deploy to Oxygen, the `createRequestHandler` utility from `@shopify/hydrogen/oxygen` (now also exported from `@shopify/hydrogen`) already sets up a Storefront API proxy on the same domain as your storefront.

**In most cases, no changes are required**; just confirm your server entry still uses it:

```ts
// server.ts (Oxygen)
import {createRequestHandler, createHydrogenContext} from '@shopify/hydrogen';

export default {
  async fetch(request, env) {
    const hydrogenContext = createHydrogenContext({
      env,
      request,
      /* ... */
    });

    const handleRequest = createRequestHandler({
      /* ... */
      getLoadContext: () => hydrogenContext,
      // Alternatively, pass at least storefront client:
      // getLoadContext: () => ({storefront: createStorefrontClient(...)})
    });

    return handleRequest(request);
  },
};
```

Keep using `<Analytics.Provider>` component or `useCustomerPrivacy` hook to get cookies in the browser automatically.

For a full example, refer to our [skeleton template](https://github.com/Shopify/hydrogen/blob/main/templates/skeleton/server.ts).

### React Router + Hydrogen on other hosts

#### Hosts that support Web Fetch API (Request/Response)

On hosts that support the standard Web Fetch API (Workers-style environments), import `createRequestHandler` from `@shopify/hydrogen` (instead of `react-router`) and route requests through it:

```ts
import {createRequestHandler, createHydrogenContext} from '@shopify/hydrogen';

const hydrogenContext = createHydrogenContext({
  /* ... */
});

const handleRequest = createRequestHandler({
  /* ... */
  getLoadContext: () => hydrogenContext,
});
```

#### Node.js and other hosts

For Node-like environments, adapt Node requests to Fetch with [`@remix-run/node-fetch-server`](https://www.npmjs.com/package/@remix-run/node-fetch-server), then delegate to Hydrogen's handler:

```ts
import {createRequestHandler, createHydrogenContext} from '@shopify/hydrogen';
import {createRequestListener} from '@remix-run/node-fetch-server';
import http from 'http';

const handleNodeRequest = createRequestListener((request) => {
  const hydrogenContext = createHydrogenContext({
    /* ... */
  });

  const handleWebRequest = createRequestHandler({
    /* ... */
    getLoadContext: () => hydrogenContext,
  });

  return handleWebRequest(request);
});

http.createServer(handleNodeRequest);
```

Alternatively, if you can't delegate to Hydrogen's `createRequestHandler`, you can provide a custom Storefront API proxy in your server. See [Hydrogen's implementation](https://github.com/Shopify/hydrogen/blob/27066a28577484f406222116a959eb463d255685/packages/hydrogen/src/storefront.ts#L546-L611) as a reference. In this case, ensure you manually pass `sameDomainForStorefrontApi: true` in the `consent` object for `<Analytics.Provider>` or as a prop to the `useCustomerPrivacy` hook.


### Improve development cold start time with static server build import [#3331](https://github.com/Shopify/hydrogen/pull/3331)

#### Step: 1. Update server.ts to use static import [#3331](https://github.com/Shopify/hydrogen/pull/3331)

> Replace the dynamic import with a static import at the top of the file.
[#3331](https://github.com/Shopify/hydrogen/pull/3331)
```diff
// server.ts

+import * as serverBuild from 'virtual:react-router/server-build';

const handleRequest = createRequestHandler({
-  build: await import('virtual:react-router/server-build'),
+  build: serverBuild,
   mode: process.env.NODE_ENV,
   getLoadContext: () => hydrogenContext,
});

// This change improves cold start time in development (2s => 200ms)
```


#### Step: 2. Update ESLint config to allow virtual: imports [#3331](https://github.com/Shopify/hydrogen/pull/3331)

> Add the virtual: prefix to the import/no-unresolved ignore list.
[#3331](https://github.com/Shopify/hydrogen/pull/3331)
```diff
// eslint.config.js

rules: {
+  'import/no-unresolved': ['error', {ignore: ['^virtual:']}],
}

// Allows virtual: imports used by React Router
```


### React Router 7.12 stabilized APIs [#3346](https://github.com/Shopify/hydrogen/pull/3346)

#### Step: 1. Update fetcher reset calls [#3346](https://github.com/Shopify/hydrogen/pull/3346)

> The `fetcher.unstable_reset()` method is now stable as `fetcher.reset()`. Update any usages in your code.
[#3346](https://github.com/Shopify/hydrogen/pull/3346)
```diff
- fetcher.unstable_reset()
+ fetcher.reset()
```


#### Step: 2. Update RouterProvider onError prop [#3346](https://github.com/Shopify/hydrogen/pull/3346)

> The `unstable_onError` prop on `<RouterProvider>` and `<HydratedRouter>` is now stable as `onError`. Update any usages in your code.
[#3346](https://github.com/Shopify/hydrogen/pull/3346)
```diff
// For RouterProvider
- <RouterProvider unstable_onError={handleError} />
+ <RouterProvider onError={handleError} />

// For HydratedRouter
- <HydratedRouter unstable_onError={handleError} />
+ <HydratedRouter onError={handleError} />
```


----
