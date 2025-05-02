import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  );
}