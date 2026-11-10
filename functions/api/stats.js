export async function onRequestGet({ env }) {
  try {
    let list = [];
    if (env && env.RSVPS) {
      const raw = await env.RSVPS.get('rsvps_list');
      if (raw) list = JSON.parse(raw);
    }
    const confirmed = list.filter(r => r.attending).length;
    const declined = list.filter(r => !r.attending).length;
    return new Response(JSON.stringify({
      total: list.length,
      confirmed,
      declined
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
