// If executed in CI / Cloudflare Pages build environment, exit cleanly instead of hanging
if (process.env.CF_PAGES || process.env.CI || process.env.CONTINUOUS_INTEGRATION) {
  console.log('Ambiente de build/CI detectado. Finalizando processo de build com sucesso.');
  process.exit(0);
}

require('./birthday-22/server.js');
