export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const playerId = searchParams.get('playerId');
    const season = searchParams.get('season') || new Date().getFullYear();
    const group = searchParams.get('group') || 'hitting';

    if (!teamId && !playerId) {
      return new Response(
        JSON.stringify({ error: 'teamId or playerId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let apiUrl;
    if (teamId) {
      apiUrl = `https://statsapi.mlb.com/api/v1/teams/${teamId}/stats?stats=season&season=${season}&group=${group}`;
    } else {
      apiUrl = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=season&season=${season}&group=${group}`;
    }

    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch MLB stats' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({ stats: data.stats || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching MLB stats:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching MLB stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
