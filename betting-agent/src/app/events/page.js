'use client';

import React, { useState, useEffect } from 'react';

import { fetchMLBSchedule, fetchMLBStats } from '@/utils/api';

export default function Events() {
  // Sport filter state
  const [selectedSport, setSelectedSport] = useState('all');

  // Events state
  const [events, setEvents] = useState([]);
  const [statsMap, setStatsMap] = useState({});

  // Sample events data - in a real app, this would come from an API
  const defaultEvents = [
    {
      id: 1,
      sport: 'football',
      sportName: 'Football',
      league: 'NFL',
      teams: 'Kansas City Chiefs vs San Francisco 49ers',
      date: '2025-06-15T20:00:00',
      venue: 'Arrowhead Stadium',
      odds: {
        favorite: 'Chiefs -3.5',
        underdog: '49ers +3.5',
        over_under: 49.5
      }
    },
    {
      id: 2,
      sport: 'basketball',
      sportName: 'Basketball',
      league: 'NBA',
      teams: 'Boston Celtics vs Los Angeles Lakers',
      date: '2025-06-10T19:30:00',
      venue: 'TD Garden',
      odds: {
        favorite: 'Celtics -5.5',
        underdog: 'Lakers +5.5',
        over_under: 219.5
      }
    },
    {
      id: 3,
      sport: 'baseball',
      sportName: 'Baseball',
      league: 'MLB',
      teams: 'New York Yankees vs Boston Red Sox',
      date: '2025-06-07T13:00:00',
      venue: 'Yankee Stadium',
      odds: {
        favorite: 'Yankees -1.5',
        underdog: 'Red Sox +1.5',
        over_under: 8.5
      }
    },
    {
      id: 4,
      sport: 'soccer',
      sportName: 'Soccer',
      league: 'Premier League',
      teams: 'Manchester City vs Liverpool',
      date: '2025-06-12T15:00:00',
      venue: 'Etihad Stadium',
      odds: {
        favorite: 'Man City -0.5',
        underdog: 'Liverpool +0.5',
        over_under: 2.5
      }
    },
    {
      id: 5,
      sport: 'hockey',
      sportName: 'Hockey',
      league: 'NHL',
      teams: 'Toronto Maple Leafs vs Montreal Canadiens',
      date: '2025-06-08T19:00:00',
      venue: 'Scotiabank Arena',
      odds: {
        favorite: 'Maple Leafs -1.5',
        underdog: 'Canadiens +1.5',
        over_under: 5.5
      }
    },
    {
      id: 6,
      sport: 'golf',
      sportName: 'Golf',
      league: 'PGA Tour',
      teams: 'The Masters Tournament',
      date: '2025-06-20T08:00:00',
      venue: 'Augusta National Golf Club',
      odds: {
        favorite: 'Scottie Scheffler +800',
        underdog: 'Jordan Spieth +2000',
        over_under: null
      }
    },
    {
      id: 7,
      sport: 'mma',
      sportName: 'MMA',
      league: 'UFC',
      teams: 'Jon Jones vs Francis Ngannou',
      date: '2025-06-17T22:00:00',
      venue: 'T-Mobile Arena',
      odds: {
        favorite: 'Jones -150',
        underdog: 'Ngannou +130',
        over_under: '3.5 rounds'
      }
    },
    {
      id: 8,
      sport: 'tennis',
      sportName: 'Tennis',
      league: 'Grand Slam',
      teams: 'Carlos Alcaraz vs Novak Djokovic',
      date: '2025-06-25T14:00:00',
      venue: 'Wimbledon',
      odds: {
        favorite: 'Alcaraz -125',
        underdog: 'Djokovic +105',
        over_under: '38.5 games'
      }
    },
  ];



  // Load initial events and refresh when sport changes
  useEffect(() => {
    async function loadEvents() {
      if (selectedSport === 'baseball') {
        try {
          const games = await fetchMLBSchedule();
          const mlbEvents = games.map((g) => ({
            id: g.gamePk,
            sport: 'baseball',
            sportName: 'Baseball',
            league: g.league?.name || 'MLB',
            teams: `${g.teams.away.team.name} vs ${g.teams.home.team.name}`,
            date: g.gameDate,
            venue: g.venue?.name || '',
            homeTeamId: g.teams.home.team.id,
            season: g.season,
            odds: {}
          }));
          setEvents(mlbEvents);
        } catch (err) {
          console.error('Failed to load MLB schedule', err);
          setEvents([]);
        }
      } else {
        setEvents(defaultEvents);
      }
    }

    loadEvents();
  }, [selectedSport]);

  // Fetch stats for a specific team and store in statsMap
  const loadStats = async (eventId, teamId, season) => {
    try {
      const stats = await fetchMLBStats({ teamId, season });
      setStatsMap(prev => ({ ...prev, [eventId]: stats }));
    } catch (err) {
      console.error('Failed to load team stats', err);
    }
  };

  

  // Filter events by sport
  const filteredEvents = selectedSport === 'all' 
    ? events 
    : events.filter(event => event.sport === selectedSport);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Betting Assistant
          </h1>
          <nav className="flex space-x-4">
            <a href="/" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</a>
            <a href="/events" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Events</a>
            <a href="/analysis" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Analysis</a>
            <a href="/history" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">History</a>
            <a href="/settings" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Browse upcoming sporting events to analyze for betting opportunities.
              </p>
            </div>
            
            {/* Sports Filter */}
            <div className="mt-4 sm:mt-0">
              <select
                id="sportFilter"
                name="sportFilter"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Sports</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="baseball">Baseball</option>
                <option value="hockey">Hockey</option>
                <option value="soccer">Soccer</option>
                <option value="mma">MMA</option>
                <option value="golf">Golf</option>
                <option value="tennis">Tennis</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => (
                <li key={event.id}>
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-md">
                            <span className="text-xs font-medium text-indigo-800 dark:text-indigo-200">
                              {event.league}
                            </span>
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                            {event.teams}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(event.date)} • {event.venue} • {event.sportName}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-start sm:items-end">
                        <a
                          href={`/analysis/new?event=${event.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Analyze Event
                        </a>
                        {event.sport === 'baseball' && (
                          <button
                            onClick={() => loadStats(event.id, event.homeTeamId, new Date(event.date).getFullYear())}
                            className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            View Stats
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Odds Display */}
                    <div className="mt-4 flex flex-wrap gap-4">
                      {event.odds.favorite && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Favorite</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{event.odds.favorite}</div>
                        </div>
                      )}
                      
                      {event.odds.underdog && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Underdog</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{event.odds.underdog}</div>
                        </div>
                      )}
                      
                    {event.odds.over_under && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Over/Under</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{event.odds.over_under}</div>
                        </div>
                      )}
                    </div>

                    {/* Team Stats Display */}
                    {statsMap[event.id] && (
                      <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium">Home Team Stats:</p>
                        <p>AVG: {statsMap[event.id][0]?.splits?.[0]?.stat?.avg}</p>
                        <p>Runs: {statsMap[event.id][0]?.splits?.[0]?.stat?.runs}</p>
                        <p>Home Runs: {statsMap[event.id][0]?.splits?.[0]?.stat?.homeRuns}</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No events found for this sport.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Betting Assistant © {new Date().getFullYear()} - AI-powered betting decision helper
          </p>
        </div>
      </footer>
    </div>
  );
}
