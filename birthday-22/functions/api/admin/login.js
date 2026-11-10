export async function onRequestPost({ request }) {
  try {
    const { username, password } = await request.json();
    if (username === 'artur.garcia' && password === 'Mateus17') {
      const token = 'cf_token_' + Date.now();
      return new Response(JSON.stringify({ success: true, token, user: username }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'Usuário ou senha incorretos.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
