import React, { ReactElement, useEffect, useState } from 'react';

interface WalletAutoConnectProps {
  children: ReactElement<{ wallet?: any }>;
}

const WalletAutoConnect: React.FC<WalletAutoConnectProps> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if ("solana" in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) {
          try {
            await provider.connect();
            setWallet(provider);
          } catch (error) {
            console.error('Wallet connection error:', error);
          }
        }
      } else {
        alert('Phantom wallet not found!');
      }
    };

    connectWallet();
  }, []);

  if (!wallet) {
    return <div>Loading...</div>;
  }

  return React.cloneElement(children, { wallet });
};

export default WalletAutoConnect;
