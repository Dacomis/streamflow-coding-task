import { Typography } from '@mui/material';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey
} from '@solana/web3.js';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

interface TokenInfo {
  mint: string;
  amount: number;
}

interface ConnectWalletType {
  wallet: any | null;
  walletPublicKey: string | null;
  tokens: TokenInfo[];
  solBalance: number | null;
}

const AutoConnectWallet = createContext<ConnectWalletType | undefined>(
  undefined
);

export const AutoConnectWalletProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [wallet, setWallet] = useState<any>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if ('solana' in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) {
          try {
            await provider.connect();
            setWallet(provider);

            setWalletPublicKey(provider.publicKey.toBase58());

            walletPublicKey && fetchTokens(walletPublicKey);
            walletPublicKey && fetchSolBalance(walletPublicKey);
          } catch (error) {
            console.error('Wallet connection error:', error);
          }
        }
      } else {
        alert('Phantom wallet not found!');
      }
    };

    const fetchTokens = async (publicKey: string) => {
      try {
        const connection = new Connection('https://api.devnet.solana.com');

        const filters: GetProgramAccountsFilter[] = [
          {
            dataSize: 165 // size of account (bytes)
          },
          {
            memcmp: {
              offset: 32, // location of our query in the account (bytes)
              bytes: publicKey // our search criteria, a base58 encoded string
            }
          }
        ];

        const accounts = await connection.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID,
          { filters: filters }
        );

        if (accounts.length === 0) {
          console.log(
            'No token accounts found. Ensure the wallet has token accounts on Devnet.'
          );
        }

        const tokens = accounts.map((account) => {
          const parsedAccountInfo: any = account.account.data;
          const mintAddress: string =
            parsedAccountInfo['parsed']['info']['mint'];
          const tokenBalance: number =
            parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];

          return {
            mint: mintAddress,
            amount: tokenBalance
          };
        });

        setTokens(tokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      }
    };

    const fetchSolBalance = async (publicKey: string) => {
      try {
        const connection = new Connection('https://api.devnet.solana.com');
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setSolBalance(balance / 1e9); // Store balance in SOL
      } catch (error) {
        console.error('Failed to fetch SOL balance:', error);
      }
    };

    connectWallet();
  }, [walletPublicKey]);

  if (!wallet) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <AutoConnectWallet.Provider
      value={{ wallet, tokens, solBalance, walletPublicKey }}
    >
      {children}
    </AutoConnectWallet.Provider>
  );
};

export const useAutoConnectWallet = () => {
  const context = useContext(AutoConnectWallet);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
