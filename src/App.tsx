import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DataProvider from './contexts/DataContext';
import EmotionLabeler from './components/EmotionLabeler';
import { Toaster } from 'react-hot-toast';
import EmptyState from './components/EmptyState';

const App: React.FC = () => {
  const [hasData, setHasData] = useState(false);

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Toaster position="top-right" />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          {!hasData ? (
            <div className="max-w-3xl mx-auto">
              <FileUpload onDataLoaded={() => setHasData(true)} />
              <EmptyState />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <EmotionLabeler />
            </div>
          )}
        </main>
        <footer className="py-4 bg-white border-t border-gray-200">
          <div className="container mx-auto text-center text-sm text-gray-500">
            2025 Emotion Labeling Tool
          </div>
        </footer>
      </div>
    </DataProvider>
  );
};

export default App;
