import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

interface TokenInfo {
  mint: string
  amount: number
}

interface ConnectWalletType {
  wallet: any | null
  walletPublicKey: string | null
  tokens: TokenInfo[]
  solBalance: number | null
  connectWallet: () => void
  disconnectWallet: () => void
}

const ConnectWallet = createContext<ConnectWalletType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [wallet, setWallet] = useState<any | null>(null)
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null)
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [solBalance, setSolBalance] = useState<number | null>(null)

  const connectWallet = async () => {
    try {
      const { solana } = window as any
      if (solana && solana.isPhantom) {
        const response = await solana.connect()
        setWallet(response)

        if (response && response.publicKey) {
          const publicKey = response.publicKey.toBase58()
          setWalletPublicKey(publicKey)
          console.log(`Wallet connected: ${publicKey}`)
          fetchTokens(publicKey)
          fetchSolBalance(publicKey)
        }
      } else {
        alert('Phantom wallet not found!')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
    }
  }

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any
      if (solana && solana.isPhantom) {
        await solana.disconnect()
        setWallet(null)
        setWalletPublicKey(null)
        setTokens([])
        setSolBalance(null)
      }
    } catch (error) {
      console.error('Wallet disconnection error:', error)
    }
  }

  const fetchTokens = async (publicKey: string) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com')

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
      ]

      console.log('Fetching token accounts with filters:', filters)

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        { filters: filters }
      )

      console.log(
        `Found ${accounts.length} token account(s) for wallet ${publicKey}.`
      )

      if (accounts.length === 0) {
        console.log(
          'No token accounts found. Ensure the wallet has token accounts on Devnet.'
        )
      }

      const tokens = accounts.map((account) => {
        const parsedAccountInfo: any = account.account.data
        console.log('Parsed account info:', parsedAccountInfo)
        const mintAddress: string = parsedAccountInfo['parsed']['info']['mint']
        const tokenBalance: number =
          parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount']

        return {
          mint: mintAddress,
          amount: tokenBalance
        }
      })

      console.log('Fetched tokens:', tokens)
      setTokens(tokens)
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    }
  }

  const fetchSolBalance = async (publicKey: string) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com')
      const balance = await connection.getBalance(new PublicKey(publicKey))
      console.log(`SOL balance: ${balance / 1e9} SOL`) // Convert from lamports to SOL
      setSolBalance(balance / 1e9) // Store balance in SOL
    } catch (error) {
      console.error('Failed to fetch SOL balance:', error)
    }
  }

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <ConnectWallet.Provider
      value={{
        wallet,
        walletPublicKey,
        tokens,
        solBalance,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </ConnectWallet.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(ConnectWallet)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
