const { put, head, getDownloadUrl } = require('@vercel/blob');

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

module.exports = async (req, res) => {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      try {
        const url = process.env.BLOB_URL;
        if (!url) return res.status(200).json({ state: null });
        const r = await fetch(url);
        const state = await r.json();
        return res.status(200).json({ state });
      } catch {
        return res.status(200).json({ state: null });
      }
    }

    if (req.method === 'POST') {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Estado inválido.' });
      }
      const blob = await put('bolao-state.json', JSON.stringify(body), {
        access: 'public',
        allowOverwrite: true,
      });
      process.env.BLOB_URL = blob.url;
      return res.status(200).json({ ok: true, url: blob.url });
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
