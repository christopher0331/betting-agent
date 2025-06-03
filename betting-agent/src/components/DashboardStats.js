import React, { useEffect, useState } from 'react';
import { getBettingHistory } from '@/utils/api';

export function DashboardStats() {
  const [stats, setStats] = useState([
    { name: 'Total Analyses', stat: '0' },
    { name: 'Success Rate', stat: '0%' },
    { name: 'Average ROI', stat: '0%' },
    { name: 'Pending Decisions', stat: '0' },
  ]);

  useEffect(() => {
    const history = getBettingHistory();

    const total = history.length;
    const completed = history.filter(h => h.outcome && h.outcome !== 'pending');
    const wins = completed.filter(h => h.outcome === 'win').length;
    const pending = history.filter(h => h.outcome === 'pending').length;

    let avgRoi = 0;
    if (completed.length > 0) {
      const totalRoi = completed.reduce((sum, h) => {
        const value = parseFloat(String(h.roi || '').replace(/[%+]/g, ''));
        return !isNaN(value) ? sum + value : sum;
      }, 0);
      avgRoi = totalRoi / completed.length;
    }

    const newStats = [
      { name: 'Total Analyses', stat: String(total) },
      {
        name: 'Success Rate',
        stat: completed.length > 0 ? `${((wins / completed.length) * 100).toFixed(1)}%` : '0%',
      },
      { name: 'Average ROI', stat: `${avgRoi.toFixed(1)}%` },
      { name: 'Pending Decisions', stat: String(pending) },
    ];

    setStats(newStats);
  }, []);

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-indigo-500 rounded-md p-3">
                {item.name === 'Total Analyses' && (
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                )}
                {item.name === 'Success Rate' && (
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.name === 'ROI' && (
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.name === 'Pending Decisions' && (
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-300 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
