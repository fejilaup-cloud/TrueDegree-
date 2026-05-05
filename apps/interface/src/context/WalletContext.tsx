'use client';

import React, { createContext, useContext, useState } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTx: (tx: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // Freighter wallet connection
      if (typeof window !== 'undefined' && (window as any).freighter) {
        const publicKey = await (window as any).freighter.getPublicKey();
        setAddress(publicKey);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const signTx = async (tx: string): Promise<string> => {
    try {
      if (typeof window !== 'undefined' && (window as any).freighter) {
        return await (window as any).freighter.signTransaction(tx, {
          networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || '',
        });
      }
      throw new Error('Freighter not available');
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect, signTx }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
