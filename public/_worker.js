export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Try to serve the static asset first
    let response = await env.ASSETS.fetch(request);

    // If not found, fall back to index.html for client-side routing
    if (response.status === 404) {
      const indexRequest = new Request(url.origin + '/index.html', request);
      response = await env.ASSETS.fetch(indexRequest);
    }

    return response;
  },
};
