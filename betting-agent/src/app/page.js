import Image from "next/image";
import { DashboardStats } from "../components/DashboardStats";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { RecentAnalyses } from "../components/RecentAnalyses";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Betting Assistant
          </h1>
          <nav className="flex space-x-4">
            <a href="/" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</a>
            <a href="/events" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Events</a>
            <a href="/analysis" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Analysis</a>
            <a href="/history" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">History</a>
            <a href="/settings" className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Settings</a>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Overview */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h2>
          
          {/* Stats Overview */}
          <DashboardStats />
          
          {/* Main Dashboard Content */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Events</h3>
                <UpcomingEvents />
              </div>
            </div>
            
            {/* Recent Analyses */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Analyses</h3>
                <RecentAnalyses />
              </div>
            </div>
          </div>
          
          {/* New Analysis CTA */}
          <div className="mt-8 bg-indigo-700 rounded-lg shadow-md">
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-white">Ready to analyze a new event?</h3>
                <p className="text-indigo-200 mt-1">Get AI-powered insights to help with your betting decisions</p>
              </div>
              <a 
                href="/analysis/new" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
              >
                New Analysis
              </a>
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
