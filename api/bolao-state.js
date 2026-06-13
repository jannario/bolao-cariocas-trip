const { put, list } = require('@vercel/blob');

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

module.exports = async (req, res) => {
  Object.entries(HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'bolao-state', token: process.env.BLOB_READ_WRITE_TOKEN });
      if (!blobs || blobs.length === 0) {
        return res.status(200).json({ state: null });
      }
      const r = await fetch(blobs[0].downloadUrl);
      const state = await r.json();
      return res.status(200).json({ state });
    } catch (error) {
      return res.status(200).json({ state: null });
    }
  }

  if (req.method === 'POST') {
    try {
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
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' });
};
