'use client';

import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load saved API key on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      // Display masked API key for security
      setApiKey('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    }
  }, []);
  
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key (should start with sk-)');
      return;
    }
    
    setLoading(true);
    // In a real application, we might verify the API key by making a test call
    
    // For this demo, we'll just save the key to localStorage
    // In a production app, consider more secure storage options or server-side storage
    localStorage.setItem('openai_api_key', apiKey);
    
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      
      // Reset saved message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }, 1000);
  };
  
  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
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
            <a href="/analysis" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Analysis</a>
            <a href="/history" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">History</a>
            <a href="/settings" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your API keys and preferences.
            </p>
          </div>

          {/* API Key Form */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                OpenAI API Key
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Required for AI-powered betting analysis.
              </p>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              )}
              
              {saved && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-200">Settings saved successfully!</p>
                </div>
              )}
              
              <form onSubmit={handleSaveApiKey}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      OpenAI API Key
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="password"
                        name="api_key"
                        id="api_key"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setError(null);
                        }}
                        className="block w-full pr-10 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="sk-..."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Your API key is stored locally and is never sent to our servers. 
                      Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">OpenAI Dashboard</a>.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save API Key'}
                    </button>
                    
                    {apiKey && (
                      <button
                        type="button"
                        onClick={handleRemoveApiKey}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Remove Key
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Usage Information */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                OpenAI API Usage Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Each betting analysis typically costs between $0.05 - $0.15 in OpenAI API credits.</li>
                  <li>The application uses GPT-4 for high-quality betting insights and recommendations.</li>
                  <li>Your API key is stored securely in your browser's local storage.</li>
                  <li>For privacy and security, we never store your API key on our servers.</li>
                  <li>You can monitor your OpenAI API usage and costs on the <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">OpenAI usage dashboard</a>.</li>
                </ul>
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
