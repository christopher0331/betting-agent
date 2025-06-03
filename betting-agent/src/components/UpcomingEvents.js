import React, { useEffect, useState } from 'react';
import { fetchMLBSchedule } from '@/utils/api';

export function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const games = await fetchMLBSchedule();
        const mapped = games.map((g) => ({
          id: g.gamePk,
          league: g.league?.name || 'MLB',
          teams: `${g.teams.away.team.name} vs ${g.teams.home.team.name}`,
          date: g.gameDate,
          type: 'baseball',
        }));
        setEvents(mapped);
      } catch (e) {
        console.error('Failed to load events', e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get sport icon based on type
  const getSportIcon = (type) => {
    switch(type) {
      case 'football':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm.86 15.84c-.9.19-1.83.16-2.71-.08 2.03-1.06 3.18-3.52 3.18-5.76 0-2.23-1.15-4.69-3.18-5.76.88-.24 1.81-.27 2.71-.08 1.58.33 2.97 1.19 4.01 2.36-2.48 1.01-4.19 3.5-4.19 6.34 0 2.84 1.71 5.33 4.19 6.34-1.04 1.17-2.43 2.03-4.01 2.36z"/>
          </svg>
        );
      case 'basketball':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5c0 .526-.27.988-.678 1.256a6.012 6.012 0 01-2.706 1.912 6.022 6.022 0 011.249 2.145c.194-.333.44-.663.78-.973a6.018 6.018 0 013.041-1.669c-.188.387-.293.82-.293 1.279 0 .46.105.892.293 1.279a6.017 6.017 0 01-3.041-1.669c-.34-.31-.587-.64-.78-.973a6.012 6.012 0 01-1.249 2.145 6.012 6.012 0 012.706 1.912C9.728 13.988 10 14.45 10 15a1.5 1.5 0 01-3 0c0-.526.27-.988.678-1.256a6.012 6.012 0 01-1.912-2.706 6.012 6.012 0 01-2.145 1.249c.333.194.663.44.973.78a6.017 6.017 0 011.669 3.041A4.99 4.99 0 015 15c0-.46.105-.892.293-1.279a6.017 6.017 0 01-3.041 1.669c.194-.333.44-.663.78-.973a6.012 6.012 0 012.145-1.249z" clipRule="evenodd" />
          </svg>
        );
      case 'baseball':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 11.25A.75.75 0 017.5 12h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75zm0-4.5A.75.75 0 017.5 7.5h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        );
      case 'soccer':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5c0 .526-.27.988-.678 1.256a6.012 6.012 0 01-2.706 1.912 6.022 6.022 0 011.249 2.145c.194-.333.44-.663.78-.973a6.018 6.018 0 013.041-1.669c-.188.387-.293.82-.293 1.279 0 .46.105.892.293 1.279a6.017 6.017 0 01-3.041-1.669c-.34-.31-.587-.64-.78-.973a6.012 6.012 0 01-1.249 2.145 6.012 6.012 0 012.706 1.912C9.728 13.988 10 14.45 10 15a1.5 1.5 0 01-3 0c0-.526.27-.988.678-1.256a6.012 6.012 0 01-1.912-2.706 6.012 6.012 0 01-2.145 1.249c.333.194.663.44.973.78a6.017 6.017 0 011.669 3.041A4.99 4.99 0 015 15c0-.46.105-.892.293-1.279a6.017 6.017 0 01-3.041 1.669c.194-.333.44-.663.78-.973a6.012 6.012 0 012.145-1.249z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events found.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <li key={event.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{getSportIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {event.teams}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.league} • {formatDate(event.date)}
                  </p>
                </div>
                <div>
                  <a
                    href={`/analysis/new?event=${event.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Analyze
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 text-center">
        <a href="/events" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
          View All Events
          <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
