const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// If executed in Cloudflare Pages build environment, exit cleanly instead of hanging
if (process.env.CF_PAGES === '1' || process.env.CF_PAGES) {
  console.log('Ambiente de build do Cloudflare Pages detectado. Finalizando processo de build com sucesso.');
  process.exit(0);
}

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'rsvps.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure data folder and file exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

function readRSVPs() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading RSVPs:', err);
    return [];
  }
}

function writeRSVPs(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing RSVPs:', err);
    return false;
  }
}

// Simple token storage
const activeSessions = new Set();
const ADMIN_USER = 'artur.garcia';
const ADMIN_PASS = 'Mateus17';

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- API ROUTES ---

  // 1. Submit RSVP (Guest)
  if (pathname === '/api/rsvp' && req.method === 'POST') {
    try {
      const { name, attending } = await parseBody(req);
      if (!name || typeof name !== 'string' || name.trim() === '') {
        return sendJSON(res, 400, { error: 'O nome é obrigatório.' });
      }
      if (attending === undefined || typeof attending !== 'boolean') {
        return sendJSON(res, 400, { error: 'Informe se vai ou não.' });
      }

      const list = readRSVPs();
      const cleanName = name.trim();
      const now = new Date().toISOString();

      // Check if this person already answered (update existing or add new)
      const existingIdx = list.findIndex(r => r.name.toLowerCase() === cleanName.toLowerCase());
      let entry;

      if (existingIdx >= 0) {
        list[existingIdx].attending = attending;
        list[existingIdx].updatedAt = now;
        entry = list[existingIdx];
      } else {
        entry = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          name: cleanName,
          attending: attending,
          createdAt: now,
          updatedAt: now
        };
        list.unshift(entry);
      }

      writeRSVPs(list);
      return sendJSON(res, 200, { success: true, rsvp: entry });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Erro ao processar confirmação.' });
    }
  }

  // 2. Public Quick Stats (counts)
  if (pathname === '/api/stats' && req.method === 'GET') {
    const list = readRSVPs();
    const confirmed = list.filter(r => r.attending).length;
    const declined = list.filter(r => !r.attending).length;
    return sendJSON(res, 200, {
      total: list.length,
      confirmed,
      declined
    });
  }

  // 3. Admin Login
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const { username, password } = await parseBody(req);
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2);
      activeSessions.add(token);
      return sendJSON(res, 200, { success: true, token, user: username });
    }
    return sendJSON(res, 401, { error: 'Usuário ou senha incorretos.' });
  }

  // Auth helper for Admin
  const authHeader = req.headers['authorization'];
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;
  const isAuth = token && activeSessions.has(token);

  // 4. Admin Get RSVPs
  if (pathname === '/api/admin/rsvps' && req.method === 'GET') {
    if (!isAuth) {
      return sendJSON(res, 401, { error: 'Acesso não autorizado.' });
    }
    const list = readRSVPs();
    return sendJSON(res, 200, { rsvps: list });
  }

  // 5. Admin Delete RSVP
  if (pathname.startsWith('/api/admin/rsvps/') && req.method === 'DELETE') {
    if (!isAuth) {
      return sendJSON(res, 401, { error: 'Acesso não autorizado.' });
    }
    const id = pathname.replace('/api/admin/rsvps/', '');
    let list = readRSVPs();
    const beforeCount = list.length;
    list = list.filter(r => r.id !== id);
    if (list.length < beforeCount) {
      writeRSVPs(list);
      return sendJSON(res, 200, { success: true });
    }
    return sendJSON(res, 404, { error: 'Item não encontrado.' });
  }

  // 6. Admin Logout
  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    if (token) activeSessions.delete(token);
    return sendJSON(res, 200, { success: true });
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acesso proibido');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client-side routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (err2, content) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err3, data) => {
      if (err3) {
        res.writeHead(500);
        return res.end('Erro ao carregar arquivo');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`🚀 Convite 22 Anos - Artur Garcia`);
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`🔐 Painel Admin: login 'artur.garcia' / senha 'Mateus17'`);
  console.log(`==============================================\n`);
});
