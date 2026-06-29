// Netlify Function: adapter API untuk frontend.
// Menggantikan peran server.ts (Express) yang tidak bisa dijalankan sebagai
// proses persistent di Netlify. Logikanya sama: menerjemahkan rute yang
// dipanggil frontend (src/lib/api.ts) menjadi rute milik API eksternal di
// vps-donghuawatch.vercel.app, lalu meneruskan hasilnya ke client.

const API_BASE = 'https://vps-donghuawatch.vercel.app';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json, text/plain, */*',
};

async function fetchJson(path: string): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON dari upstream API');
  }
}

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event: any) => {
  try {
    // event.path bisa berupa "/api/donghua/ongoing" ataupun
    // "/.netlify/functions/api/donghua/ongoing" tergantung cara redirect
    // dipicu (langsung atau lewat netlify dev). Ambil bagian setelah "/api"
    // yang TERAKHIR muncul agar konsisten di kedua kasus.
    const rawPath = event.path || '';
    const marker = '/api';
    const idx = rawPath.lastIndexOf(marker);
    const subPath = idx !== -1 ? rawPath.slice(idx + marker.length) : rawPath;
    const segments = subPath.split('/').filter(Boolean); // tanpa "" kosong

    const params = event.queryStringParameters || {};
    const page = params.page ? parseInt(params.page, 10) || 1 : 1;
    const mode = params.mode === 'anime' ? 'anime' : 'donghua';

    let data: any;

    if (segments[0] === 'anime' && segments[1] === 'schedule') {
      data = await fetchJson('/api/anime/schedule');
    } else if (segments[0] === 'donghua' && segments[1] === 'schedule') {
      data = await fetchJson('/api/schedule');
    } else if (segments[0] === 'search') {
      const q = params.q;
      if (!q) return json(400, { error: "Query 'q' is required" });
      data =
        mode === 'anime'
          ? await fetchJson(`/api/anime/search/${encodeURIComponent(q)}`)
          : await fetchJson(`/api/search/${encodeURIComponent(q)}/${page}`);
    } else if (segments[0] === 'detail' && segments[1]) {
      const slug = segments.slice(1).join('/');
      data =
        mode === 'anime'
          ? await fetchJson(`/api/anime/detail/${slug}`)
          : await fetchJson(`/api/detail/${slug}`);
    } else if (segments[0] === 'episode' && segments[1]) {
      const slug = segments.slice(1).join('/');
      data =
        mode === 'anime'
          ? await fetchJson(`/api/anime/episode/${slug}`)
          : await fetchJson(`/api/episode/${slug}`);
    } else if (segments[0] === 'donghua' && segments[1] === 'completed') {
      data = await fetchJson(`/api/completed/${page}`);
    } else if (segments[0] === 'donghua' && segments[1] === 'ongoing') {
      data = await fetchJson(`/api/ongoing/${page}`);
    } else if (segments[0] === 'anime' && segments[1] === 'completed') {
      data = await fetchJson(`/api/anime/completed/${page}`);
    } else if (segments[0] === 'anime' && segments[1] === 'ongoing') {
      data = await fetchJson(`/api/anime/ongoing/${page}`);
    } else {
      return json(404, { error: 'Route tidak ditemukan', path: subPath });
    }

    return json(200, { success: true, data });
  } catch (e: any) {
    return json(500, { error: e.message || 'Internal error' });
  }
};
