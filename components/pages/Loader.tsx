import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-24 h-24 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
      <span className="mt-4 text-blue-600 text-2xl font-semibold">Loading...</span>
    </div>
  );
};

export default Loader;
