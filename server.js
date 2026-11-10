// If executed in Cloudflare Pages build environment, exit cleanly instead of hanging
if (process.env.CF_PAGES === '1' || process.env.CF_PAGES) {
  console.log('Ambiente de build do Cloudflare Pages detectado. Finalizando processo de build com sucesso.');
  process.exit(0);
}

require('./birthday-22/server.js');
