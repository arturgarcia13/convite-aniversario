export async function onRequestDelete({ params, env }) {
  try {
    const id = params.id;
    if (env && env.RSVPS) {
      let list = [];
      const raw = await env.RSVPS.get('rsvps_list');
      if (raw) list = JSON.parse(raw);
      list = list.filter(r => r.id !== id);
      await env.RSVPS.put('rsvps_list', JSON.stringify(list));
    }
    return new Response(JSON.stringify({ success: true }), {
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
