'use client';

import React, { useState, useEffect } from 'react';
import { fetchMLBSchedule } from '@/utils/api';

export default function Events() {
  // Sport filter state
  const [selectedSport, setSelectedSport] = useState('all');

  // Events state
  const [events, setEvents] = useState([]);




  // Load initial events and refresh when sport changes
  useEffect(() => {
    async function loadEvents() {
      if (selectedSport === 'baseball' || selectedSport === 'all') {
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
            odds: {}
          }));
          setEvents(mlbEvents);
        } catch (err) {
          console.error('Failed to load MLB schedule', err);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    }

    loadEvents();
  }, [selectedSport]);
  

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
