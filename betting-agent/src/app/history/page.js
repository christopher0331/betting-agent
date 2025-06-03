'use client';

import React, { useState, useEffect } from 'react';

export default function History() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load saved analyses on component mount
  useEffect(() => {
    // In a real app, this would come from a database
    // Here we'll simulate getting it from localStorage
    const timer = setTimeout(() => {
      const mockAnalyses = [
        {
          id: '12345',
          date: '2025-05-28',
          event: {
            sport: 'Football',
            league: 'NFL',
            teams: 'Dallas Cowboys vs Philadelphia Eagles',
          },
          recommendation: 'Cowboys +3.5',
          confidence: 0.84,
          outcome: 'win',
          roi: '+110',
        },
        {
          id: '12346',
          date: '2025-05-26',
          event: {
            sport: 'Basketball',
            league: 'NBA',
            teams: 'Los Angeles Lakers vs Golden State Warriors',
          },
          recommendation: 'Over 219.5',
          confidence: 0.65,
          outcome: 'loss',
          roi: '-110',
        },
        {
          id: '12347',
          date: '2025-05-24',
          event: {
            sport: 'Baseball',
            league: 'MLB',
            teams: 'New York Yankees vs Boston Red Sox',
          },
          recommendation: 'Yankees ML',
          confidence: 0.78,
          outcome: 'win',
          roi: '-105',
        },
        {
          id: '12348',
          date: '2025-05-22',
          event: {
            sport: 'Soccer',
            league: 'Premier League',
            teams: 'Arsenal vs Manchester United',
          },
          recommendation: 'Draw',
          confidence: 0.52,
          outcome: 'pending',
          roi: '+240',
        },
        {
          id: '12349',
          date: '2025-05-20',
          event: {
            sport: 'Hockey',
            league: 'NHL',
            teams: 'Toronto Maple Leafs vs Montreal Canadiens',
          },
          recommendation: 'Under 5.5',
          confidence: 0.71,
          outcome: 'win',
          roi: '-115',
        },
        {
          id: '12350',
          date: '2025-05-18',
          event: {
            sport: 'Football',
            league: 'NFL',
            teams: 'Buffalo Bills vs Miami Dolphins',
          },
          recommendation: 'Bills -2.5',
          confidence: 0.68,
          outcome: 'push',
          roi: 'Even',
        },
        {
          id: '12351',
          date: '2025-05-16',
          event: {
            sport: 'Basketball',
            league: 'NBA',
            teams: 'Boston Celtics vs Milwaukee Bucks',
          },
          recommendation: 'Celtics -4.5',
          confidence: 0.75,
          outcome: 'loss',
          roi: '-110',
        },
      ];
      
      setAnalyses(mockAnalyses);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter and sort analyses
  const filteredAndSortedAnalyses = [...analyses]
    .filter(analysis => {
      if (filter === 'all') return true;
      return analysis.outcome === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date); // Newest first
      } else if (sortBy === 'confidence') {
        return b.confidence - a.confidence; // Highest confidence first
      }
      return 0;
    });
  
  // Get outcome badge
  const getOutcomeBadge = (outcome) => {
    switch(outcome) {
      case 'win':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Win
          </span>
        );
      case 'loss':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            Loss
          </span>
        );
      case 'push':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            Push
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            Pending
          </span>
        );
    }
  };
  
  // Get confidence level visual
  const getConfidenceLevel = (confidence) => {
    let color = 'yellow';
    
    if (confidence >= 0.8) {
      color = 'green';
    } else if (confidence <= 0.5) {
      color = 'red';
    }
    
    return (
      <div className="flex items-center">
        <div className={`w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2`}>
          <div className={`bg-${color}-500 h-2.5 rounded-full`} style={{ width: `${confidence * 100}%` }}></div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{(confidence * 100).toFixed(0)}%</span>
      </div>
    );
  };
  
  // Calculate statistics
  const stats = {
    total: analyses.length,
    wins: analyses.filter(a => a.outcome === 'win').length,
    losses: analyses.filter(a => a.outcome === 'loss').length,
    pushes: analyses.filter(a => a.outcome === 'push').length,
    pending: analyses.filter(a => a.outcome === 'pending').length,
  };
  
  stats.winRate = stats.total > 0 
    ? `${(stats.wins / (stats.total - stats.pending) * 100).toFixed(1)}%` 
    : 'N/A';
  
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
            <a href="/events" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Events</a>
            <a href="/analysis" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Analysis</a>
            <a href="/history" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400">History</a>
            <a href="/settings" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Betting History</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track your betting decisions and outcomes over time.
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Analyses</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.total}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Wins</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.wins}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Losses</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.losses}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Win Rate</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.winRate}</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.pending}</dd>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter
                </label>
                <select
                  id="filter"
                  name="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Analyses</option>
                  <option value="win">Wins Only</option>
                  <option value="loss">Losses Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="confidence">Confidence (Highest First)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <a
                href="/analysis/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Analysis
              </a>
            </div>
          </div>
          
          {/* Loading State */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading your betting history...</p>
            </div>
          ) : (
            <>
              {/* Analysis List */}
              {filteredAndSortedAnalyses.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedAnalyses.map((analysis) => (
                      <li key={analysis.id}>
                        <a href={`/analysis/results?id=${analysis.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                {analysis.event.teams}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                {getOutcomeBadge(analysis.outcome)}
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  {analysis.event.sport} • {analysis.event.league}
                                </p>
                                <p className="mt-2 sm:mt-0 sm:ml-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(analysis.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="mr-2">{analysis.recommendation}</span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                  {analysis.roi}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span className="mr-1">Confidence:</span> {getConfidenceLevel(analysis.confidence)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-12 text-center bg-white dark:bg-gray-800 shadow rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'all' ? 'No betting analyses found.' : `No ${filter} analyses found.`}
                  </p>
                  <div className="mt-4">
                    <a
                      href="/analysis/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create Your First Analysis
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
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
