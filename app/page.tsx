import { Suspense } from 'react';
import ReviewGenerator from './ReviewGenerator';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
          <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin mb-4"></div>
          <p className="text-sm font-medium">Laden...</p>
        </div>
      }
    >
      <ReviewGenerator />
    </Suspense>
  );
}
