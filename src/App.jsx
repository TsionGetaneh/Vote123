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
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) throw new Error('No accounts found');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setAccount(address);
    } catch (err) {
      setError(err.message || 'Failed to connect');
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
          console.error(err);
        }
      }
    };
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) disconnectWallet();
        else setAccount(accounts[0]);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const value = { account, provider, contract, error, loading, connectWallet, disconnectWallet };
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export { useWeb3, Web3Provider };

const AppContent = () => {
  const { account, error } = useWeb3();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          fontFamily: "'Space Grotesk', monospace",
        }}>
          🗳️ Secure Voting DApp
        </h1>
        <ConnectWallet />
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            textAlign: 'center',
            color: '#fca5a5',
          }}>
            ⚠️ {error}
          </div>
        )}

        {account ? (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          }}>
            <div className="glass-card" style={{ overflow: 'hidden' }}><VoterRegistration /></div>
            <div className="glass-card" style={{ overflow: 'hidden' }}><ProposalForm /></div>
            <div className="glass-card" style={{ overflow: 'hidden' }}><AdminPanel /></div>
            <div className="glass-card" style={{ overflow: 'hidden', gridColumn: '1 / -1' }}><ProposalList /></div>
          </div>
        ) : (
          <div className="glass-card" style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Connect your wallet to start voting</p>
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