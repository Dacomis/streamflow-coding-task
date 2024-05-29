import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConnectWalletType {
  wallet: any | null;
  walletPublicKey: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const ConnectWallet = createContext<ConnectWalletType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        setWallet(response);
  
        if (response && response.publicKey) {
          setWalletPublicKey(response.publicKey.toBase58());
        }
      } else {
        alert('Phantom wallet not found!');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;
      if (solana && solana.isPhantom) {
        await solana.disconnect();
        setWallet(null);

        setWalletPublicKey(null)
      }
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <ConnectWallet.Provider value={{ wallet, walletPublicKey, connectWallet, disconnectWallet }}>
      {children}
    </ConnectWallet.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(ConnectWallet);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
