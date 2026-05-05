'use client';

import React, { createContext, useContext, useState } from 'react';
import * as freighter from '@stellar/freighter-api';

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
      const publicKey = await freighter.requestPublicKey();
      setAddress(publicKey);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const signTx = async (tx: string): Promise<string> => {
    return await freighter.signTransaction(tx, {
      networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || '',
    });
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
