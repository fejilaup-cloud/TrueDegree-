'use client';

import { useWallet } from '@/context/WalletContext';

export default function Navbar() {
  const { address, isConnected, connect, disconnect } = useWallet();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">TrueDegree</h1>
        <button
          onClick={isConnected ? disconnect : connect}
          className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100"
        >
          {isConnected ? `${address?.slice(0, 6)}...` : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}
