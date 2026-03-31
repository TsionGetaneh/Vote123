import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import ConnectWallet from "./components/connectWallet";
import VoterRegistration from "./components/VoterRegistration";
import ProposalForm from "./components/ProposalForm";
import AdminPanel from "./components/AdminPanel";
import ProposalList from "./components/ProposalList";
import "./index.css";

const Web3Context = createContext();

const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    console.log('Connect wallet called');
    
    if (typeof window.ethereum === 'undefined') {
      console.log('MetaMask not installed');
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Requesting accounts...');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);
      
      if (accounts.length === 0) {
        setError('No accounts found. Please connect an account in MetaMask.');
        return;
      }

      console.log('Creating provider...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log('Address:', address);

      setProvider(provider);
      setAccount(address);
      console.log('Wallet connected successfully!');
      
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setError(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const value = {
    account,
    provider,
    contract,
    error,
    loading,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export { useWeb3, Web3Provider };

const AppContent = () => {
  const { account, error } = useWeb3();

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%)',
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1.5rem',
          letterSpacing: '-0.025em',
        }}>
          🗳️ Secure Voting DApp
        </h1>
        <ConnectWallet />
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {error && (
          <div style={{
            color: '#991b1b',
            textAlign: 'center',
            marginBottom: '1.5rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '1rem',
            border: '1px solid #fecaca',
            backdropFilter: 'blur(4px)',
            fontSize: '0.875rem',
          }}>
            <strong>⚠️ Error:</strong> {error}
            <br />
            <small>Check browser console (F12) for more details</small>
          </div>
        )}

        {account ? (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              <VoterRegistration />
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
              overflow: 'hidden',
            }}>
              <ProposalForm />
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
              overflow: 'hidden',
            }}>
              <AdminPanel />
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02)',
              overflow: 'hidden',
              gridColumn: '1 / -1',
            }}>
              <ProposalList />
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            backgroundColor: 'white',
            borderRadius: '2rem',
            boxShadow: '0 20px 25px -12px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.75rem',
            }}>
              Welcome to Secure Voting
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}>
              Please connect your wallet to access voting features
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;