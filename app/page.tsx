'use client';

import { StoryPointEstimator } from './components/StoryPointEstimator';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Story Point Estimator</h1>
      <StoryPointEstimator />
    </main>
  );
}