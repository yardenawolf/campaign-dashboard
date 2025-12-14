exports.handler = async (event) => {
  try {
    const url = event.queryStringParameters && event.queryStringParameters.url;
    if (!url) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Missing ?url=" })
      };
    }

    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("docs.google.com")) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Only docs.google.com URLs allowed" })
      };
    }

    const resp = await fetch(url, {
      headers: { "accept": "text/csv,*/*" }
    });

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: `Upstream fetch failed: ${resp.status}` })
      };
    }

    const text = await resp.text();

    return {
      statusCode: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "no-store"
      },
      body: text
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};
