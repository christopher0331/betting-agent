import React, { useEffect, useState } from 'react';
import { getBettingHistory } from '@/utils/api';

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const history = getBettingHistory();
    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    setAnalyses(sorted.slice(0, 4));
  }, []);

  const getConfidenceBadge = (confidence) => {
    switch(confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getResultBadge = (result) => {
    switch(result) {
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {analyses.map((analysis) => (
          <li key={analysis.id} className="py-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {analysis.event}
                </h4>
                <time className="text-xs text-gray-500 dark:text-gray-400">
                  {analysis.date}
                </time>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">
                    {analysis.recommendation}
                  </span>
                  <div className="ml-2">{getConfidenceBadge(analysis.confidence)}</div>
                </div>
                <div>{getResultBadge(analysis.result)}</div>
              </div>
              <div className="mt-1 flex justify-end">
                <a
                  href={`/analysis/${analysis.id}`}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View details
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <a href="/history" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
          View All Analyses
          <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
