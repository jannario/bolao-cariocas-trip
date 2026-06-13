exports.handler = async (event) => {
  const HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("bolao-cariocas-trip");
    const key = "state";

    if (event.httpMethod === "GET") {
      const state = await store.get(key, { type: "json" });
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ state: state || null }),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body || typeof body !== "object") {
        return {
          statusCode: 400,
          headers: HEADERS,
          body: JSON.stringify({ error: "Estado inválido." }),
        };
      }
      await store.setJSON(key, body);
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ ok: true }),
      };
    }

    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: "Método não permitido." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
