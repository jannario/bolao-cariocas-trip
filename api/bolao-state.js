const { put, list, getDownloadUrl } = require('@vercel/blob');

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
      const { blobs } = await list({ prefix: 'bolao-state', token: process.env.BLOB_READ_WRITE_TOKEN });
      if (!blobs.length) return res.status(200).json({ state: null });
      const r = await fetch(blobs[0].downloadUrl);
      const state = await r.json();
      return res.status(200).json({ state });
    }

    if (req.method === 'POST') {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Estado inválido.' });
      }
      await put('bolao-state.json', JSON.stringify(body), {
        access: 'public',
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  }
