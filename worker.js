/**
 * Cloudflare Worker with Static Assets
 * Handles /api/* endpoints with Workers KV persistence (env.RSVPS)
 * and delegates all static asset requests to env.ASSETS.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      ...CORS_HEADERS
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // --- API ROUTES ---

    // 1. Submit RSVP (Guest)
    if (pathname === '/api/rsvp' && request.method === 'POST') {
      try {
        const body = await request.json().catch(() => ({}));
        const { name, attending } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
          return jsonResponse({ error: 'O nome é obrigatório.' }, 400);
        }
        if (attending === undefined || typeof attending !== 'boolean') {
          return jsonResponse({ error: 'Informe se vai ou não.' }, 400);
        }

        const cleanName = name.trim();
        const now = new Date().toISOString();
        const entry = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          name: cleanName,
          attending: attending,
          createdAt: now,
          updatedAt: now
        };

        if (env && env.RSVPS) {
          let list = [];
          const raw = await env.RSVPS.get('rsvps_list');
          if (raw) {
            try { list = JSON.parse(raw); } catch (e) { list = []; }
          }

          const existingIdx = list.findIndex(r => r.name.toLowerCase() === cleanName.toLowerCase());
          if (existingIdx >= 0) {
            list[existingIdx].attending = attending;
            list[existingIdx].updatedAt = now;
          } else {
            list.unshift(entry);
          }
          await env.RSVPS.put('rsvps_list', JSON.stringify(list));
        }

        return jsonResponse({ success: true, rsvp: entry }, 200);
      } catch (err) {
        return jsonResponse({ error: 'Erro ao processar confirmação: ' + err.message }, 500);
      }
    }

    // 2. Public Quick Stats (counts)
    if (pathname === '/api/stats' && request.method === 'GET') {
      let list = [];
      if (env && env.RSVPS) {
        const raw = await env.RSVPS.get('rsvps_list');
        if (raw) {
          try { list = JSON.parse(raw); } catch (e) { list = []; }
        }
      }
      const confirmed = list.filter(r => r.attending).length;
      const declined = list.filter(r => !r.attending).length;
      return jsonResponse({
        total: list.length,
        confirmed,
        declined
      }, 200);
    }

    // 3. Admin Login
    if (pathname === '/api/admin/login' && request.method === 'POST') {
      try {
        const { username, password } = await request.json().catch(() => ({}));
        if (username === 'artur.garcia' && password === 'Mateus17') {
          const token = 'cf_token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
          return jsonResponse({ success: true, token, user: username }, 200);
        }
        return jsonResponse({ error: 'Usuário ou senha incorretos.' }, 401);
      } catch (err) {
        return jsonResponse({ error: 'Erro no login: ' + err.message }, 500);
      }
    }

    // 4. Admin Get RSVPs
    if (pathname === '/api/admin/rsvps' && request.method === 'GET') {
      let list = [];
      if (env && env.RSVPS) {
        const raw = await env.RSVPS.get('rsvps_list');
        if (raw) {
          try { list = JSON.parse(raw); } catch (e) { list = []; }
        }
      }
      return jsonResponse({ rsvps: list }, 200);
    }

    // 5. Admin Delete RSVP
    if (pathname.startsWith('/api/admin/rsvps/') && request.method === 'DELETE') {
      const id = pathname.replace('/api/admin/rsvps/', '');
      if (env && env.RSVPS) {
        let list = [];
        const raw = await env.RSVPS.get('rsvps_list');
        if (raw) {
          try { list = JSON.parse(raw); } catch (e) { list = []; }
        }
        list = list.filter(r => r.id !== id);
        await env.RSVPS.put('rsvps_list', JSON.stringify(list));
      }
      return jsonResponse({ success: true }, 200);
    }

    // 6. Admin Logout
    if (pathname === '/api/admin/logout' && request.method === 'POST') {
      return jsonResponse({ success: true }, 200);
    }

    // Fallback: Serve static assets (HTML, CSS, JS, images)
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
