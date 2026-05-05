'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import VerifyForm from '@/components/VerifyForm';
import TranscriptDisplay from '@/components/TranscriptDisplay';

export default function Home() {
  const [transcript, setTranscript] = useState(null);

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">TrueDegree</h1>
        <p className="text-lg mb-8">Verify your academic credentials on-chain</p>
        
        <VerifyForm onTranscriptFetch={setTranscript} />
        
        {transcript && <TranscriptDisplay transcript={transcript} />}
      </div>
    </main>
  );
}
