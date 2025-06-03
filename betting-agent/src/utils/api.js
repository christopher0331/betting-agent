'use client';

/**
 * API utilities for the betting assistant application
 */

/**
 * Get API key from localStorage
 * @returns {string|null} The API key or null if not found
 */
export const getApiKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('openai_api_key');
  }
  return null;
};

/**
 * Request AI analysis for a betting event
 * @param {Object} eventData - The event data to analyze
 * @returns {Promise<Object>} The analysis results
 */
export const requestAnalysis = async (eventData) => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('No API key found. Please add your OpenAI API key in Settings.');
    }
    
    // First check if we have all required fields
    if (!eventData.sport || !eventData.league || !eventData.teams) {
      throw new Error('Missing required event information. Please complete all fields.');
    }
    
    // Add the API key to request headers
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate analysis');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Analysis request failed:', error);
    throw error;
  }
};

/**
 * Save analysis results to history
 * @param {Object} analysis - The analysis to save
 * @returns {Promise<Object>} The saved analysis
 */
export const saveAnalysis = (analysis) => {
  // In a real app, this would be saved to a database
  // For now, we'll just store it in localStorage
  try {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('betting_history') || '[]');
      const updatedAnalysis = {
        ...analysis,
        id: `analysis_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        outcome: 'pending', // New analyses always start as pending
      };
      
      history.unshift(updatedAnalysis); // Add to beginning of array
      localStorage.setItem('betting_history', JSON.stringify(history));
      
      return updatedAnalysis;
    }
    throw new Error('Browser storage not available');
  } catch (error) {
    console.error('Failed to save analysis:', error);
    throw error;
  }
};

/**
 * Get betting history from localStorage
 * @returns {Array} Array of saved analyses
 */
export const getBettingHistory = () => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem('betting_history') || '[]');
    } catch (error) {
      console.error('Failed to retrieve betting history:', error);
      return [];
    }
  }
  return [];
};

/**
 * Update the outcome of an analysis in the betting history
 * @param {string} analysisId - ID of the analysis to update
 * @param {string} outcome - New outcome (win, loss, push, pending)
 * @param {string} roi - Return on investment value
 * @returns {boolean} Success status
 */
export const updateAnalysisOutcome = (analysisId, outcome, roi) => {
  if (typeof window !== 'undefined') {
    try {
      const history = JSON.parse(localStorage.getItem('betting_history') || '[]');
      const updatedHistory = history.map(item => {
        if (item.id === analysisId) {
          return { ...item, outcome, roi };
        }
        return item;
      });
      
      localStorage.setItem('betting_history', JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Failed to update analysis outcome:', error);
      return false;
    }
  }
  return false;
};

/**
 * Fetch MLB schedule data from the server
 * @param {string} [date] - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of game objects
 */
export const fetchMLBSchedule = async (date) => {
  try {
    const query = date ? `?date=${date}` : '';
    const res = await fetch(`/api/mlb/schedule${query}`);
    if (!res.ok) {
      throw new Error('Failed to fetch MLB schedule');
    }
    const data = await res.json();
    return data.games || [];
  } catch (error) {
    console.error('Error fetching MLB schedule:', error);
    throw error;
  }
};

/**
 * Fetch MLB team or player stats from the server
 * @param {Object} params - Query parameters
 * @param {string} [params.teamId] - Team ID
 * @param {string} [params.playerId] - Player ID
 * @param {string} [params.season] - Season year (defaults to current year)
 * @returns {Promise<Array>} Array of stats objects
 */
export const fetchMLBStats = async ({ teamId, playerId, season } = {}) => {
  try {
    const query = new URLSearchParams();
    if (teamId) query.append('teamId', teamId);
    if (playerId) query.append('playerId', playerId);
    if (season) query.append('season', season);
    const res = await fetch(`/api/mlb/stats?${query.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch MLB stats');
    }
    const data = await res.json();
    return data.stats || [];
  } catch (error) {
    console.error('Error fetching MLB stats:', error);
    throw error;
  }
};
