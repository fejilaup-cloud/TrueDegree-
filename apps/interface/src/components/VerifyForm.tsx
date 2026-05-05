'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';

interface VerifyFormProps {
  onTranscriptFetch: (transcript: any) => void;
}

export default function VerifyForm({ onTranscriptFetch }: VerifyFormProps) {
  const { address, isConnected } = useWallet();
  const [studentAddress, setStudentAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentAddress: studentAddress || address }),
      });
      const data = await response.json();
      onTranscriptFetch(data);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Failed to verify credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="bg-gray-100 p-6 rounded-lg max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Student Address</label>
        <input
          type="text"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
          placeholder={address || 'Enter student address'}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !isConnected}
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Verifying...' : 'Verify Credentials'}
      </button>
    </form>
  );
}
