/**
 * New Analysis Page
 * This is where users can request AI-powered analysis for betting decisions
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { requestAnalysis, saveAnalysis, getApiKey } from '@/utils/api';

export default function NewAnalysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get('event');
  
  // Check for API key
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    sport: '',
    league: '',
    teams: '',
    eventDate: '',
    betType: 'moneyline', // Default bet type
    customQuestion: '',
    loading: false,
    error: null,
  });
  
  // Check if API key is set when component mounts
  useEffect(() => {
    const apiKey = getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if API key is available
    if (!hasApiKey) {
      router.push('/settings?redirect=analysis');
      return;
    }
    
    setFormData({ ...formData, loading: true, error: null });

    try {
      // Create event data object from form data
      const eventData = {
        sport: formData.sport,
        league: formData.league,
        teams: formData.teams,
        eventDate: formData.eventDate,
        betType: formData.betType,
        customQuestion: formData.customQuestion,
      };
      
      // Make API call to get analysis
      const analysisResult = await requestAnalysis(eventData);
      
      // Save analysis to history
      const savedAnalysis = saveAnalysis(analysisResult);
      
      // Redirect to results page
      router.push(`/analysis/results?id=${savedAnalysis.id}`);
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
        error: error.message || 'Failed to generate analysis. Please try again.',
      });
    }
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
            <a href="/events" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Events</a>
            <a href="/analysis" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Analysis</a>
            <a href="/history" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">History</a>
            <a href="/settings" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">New Analysis</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Provide details about the event you want to analyze to get AI-powered betting insights.
            </p>
          </div>

          {/* Analysis Form */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            {!hasApiKey && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">API Key Required</h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        You need to set your OpenAI API key before requesting an analysis. 
                        <a href="/settings" className="font-medium underline text-yellow-700 dark:text-yellow-200 hover:text-yellow-600">Go to settings</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-6">
              {formData.error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900 p-4 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-200">{formData.error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Sport Selection */}
                <div>
                  <label htmlFor="sport" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sport
                  </label>
                  <select
                    id="sport"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a sport</option>
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

                {/* League Selection */}
                <div>
                  <label htmlFor="league" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    League
                  </label>
                  <input
                    type="text"
                    name="league"
                    id="league"
                    value={formData.league}
                    onChange={handleChange}
                    required
                    placeholder="NFL, NBA, MLB, etc."
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Teams */}
                <div className="sm:col-span-2">
                  <label htmlFor="teams" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teams/Participants
                  </label>
                  <input
                    type="text"
                    name="teams"
                    id="teams"
                    value={formData.teams}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Cowboys vs Eagles"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    id="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Bet Type */}
                <div>
                  <label htmlFor="betType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bet Type
                  </label>
                  <select
                    id="betType"
                    name="betType"
                    value={formData.betType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="moneyline">Moneyline</option>
                    <option value="spread">Spread</option>
                    <option value="total">Over/Under</option>
                    <option value="prop">Prop Bet</option>
                    <option value="parlay">Parlay</option>
                  </select>
                </div>

                {/* Custom Question */}
                <div className="sm:col-span-2">
                  <label htmlFor="customQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Specific Question (Optional)
                  </label>
                  <textarea
                    id="customQuestion"
                    name="customQuestion"
                    rows={3}
                    value={formData.customQuestion}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Any specific aspects of the game you want the AI to consider? E.g., 'Is the Cowboys' injured RB likely to impact the spread?'"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formData.loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formData.loading ? 'Analyzing...' : 'Get Analysis'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Features Explanation */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-950 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                How Our AI Helps You Make Better Betting Decisions
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Advanced Analytics</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      Our AI analyzes thousands of data points including team stats, player performance, historical matchups, and current form.
                    </dd>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Contextual Understanding</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      We consider contextual factors like injuries, weather, travel schedule, and recent team news that might impact performance.
                    </dd>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Confidence Ratings</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      Each recommendation comes with a confidence rating to help you prioritize your betting opportunities.
                    </dd>
                  </div>
                </div>
              </div>
            </div>
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
