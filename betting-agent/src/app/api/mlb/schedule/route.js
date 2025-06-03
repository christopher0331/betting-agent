export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const apiUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch MLB schedule' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const games = data.dates?.flatMap(d => d.games) || [];

    return new Response(
      JSON.stringify({ games }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching MLB schedule:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching MLB schedule' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
