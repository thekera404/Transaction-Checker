"use client";

import { useEffect, useState } from "react";

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  valueWei: string;
  valueEth: string;
  timestamp?: number;
  gasPrice?: string;
  gasLimit?: string;
  nonce?: number;
  data?: string;
  type?: 'incoming' | 'outgoing';
}

interface TransactionDetail {
  hash: string;
  from: string;
  to: string | null;
  valueWei: string;
  valueEth: string;
  gasPrice: string;
  gasPriceGwei: string;
  gasLimit: string;
  gasUsed: string;
  nonce: number;
  data: string;
  status: string;
  transactionFee: string;
  blockNumber: number;
  confirmations: number;
}

interface WalletInfo {
  address: string;
  balanceWei: string;
  balanceEth: string;
  isContract: boolean;
  recentTransactions: Transaction[];
  transactionCount: number;
}

interface ApiResponse {
  blockNumber: string;
  blockNumberDecimal: number;
  txs: Transaction[];
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackedAddress, setTrackedAddress] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  const fetchData = async (address?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = address 
        ? `/api/base/latest?limit=20&address=${address}`
        : "/api/base/latest?limit=10";
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionDetails = async (hash: string) => {
    try {
      const response = await fetch(`/api/base/transaction/${hash}`);
      if (!response.ok) throw new Error("Failed to fetch transaction details");
      
      const details = await response.json();
      if (details.error) throw new Error(details.error);
      
      setSelectedTx(details);
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      alert("Failed to fetch transaction details");
    }
  };

  const fetchWalletInfo = async (address: string) => {
    try {
      const response = await fetch(`/api/base/wallet/${address}?limit=10`);
      if (!response.ok) throw new Error("Failed to fetch wallet info");
      
      const info = await response.json();
      if (info.error) throw new Error(info.error);
      
      setWalletInfo(info);
      setShowWalletInfo(true);
    } catch (err) {
      console.error("Error fetching wallet info:", err);
      alert("Failed to fetch wallet information");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (isTracking && trackedAddress) {
        fetchData(trackedAddress);
      } else {
        fetchData();
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isTracking, trackedAddress]);

  const handleTrackAddress = () => {
    if (!trackedAddress.trim()) return;
    
    setIsTracking(true);
    fetchData(trackedAddress);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setTrackedAddress("");
    fetchData();
  };

  const handleViewWallet = () => {
    if (!trackedAddress.trim()) return;
    fetchWalletInfo(trackedAddress);
  };

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-blue-600">🔵 Base Transaction Tracker</h1>
          <p className="text-gray-600 mb-4">Live transaction monitoring for Base mainnet</p>
          
          {/* Address Tracking Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3">Track Specific Wallet</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={trackedAddress}
                  onChange={(e) => setTrackedAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTracking}
                />
              </div>
              <button
                onClick={handleTrackAddress}
                disabled={!isValidAddress(trackedAddress) || isTracking}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Track Address
              </button>
              {isTracking && (
                <>
                  <button
                    onClick={handleViewWallet}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    View Wallet
                  </button>
                  <button
                    onClick={handleStopTracking}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Stop Tracking
                  </button>
                </>
              )}
            </div>
            {trackedAddress && !isValidAddress(trackedAddress) && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid Ethereum address</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <button
              onClick={() => fetchData(isTracking ? trackedAddress : undefined)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Refresh Now"}
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-refresh every 10s</span>
            </label>
            {lastUpdate && (
              <span className="text-sm text-gray-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Status */}
          {isTracking && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800">
                🔍 Tracking wallet: <code className="bg-blue-100 px-2 py-1 rounded">{trackedAddress}</code>
              </p>
            </div>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">
              <p className="font-semibold">Error: {error}</p>
              <p className="text-sm mt-1">Please try refreshing the page or check your internet connection.</p>
            </div>
          </div>
        )}
        
        {/* Transaction Display */}
        {data && !error && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isTracking ? "Tracked Transactions" : "Latest Transactions"}
              </h2>
              <div className="text-sm text-gray-500">
                Block: {data.blockNumberDecimal}
              </div>
            </div>
            
            {data.txs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {isTracking 
                  ? "No transactions found for this wallet in the latest block"
                  : "No transactions found in the latest block"
                }
              </div>
            ) : (
              <div className="space-y-3">
                {data.txs.map((tx: Transaction) => (
                  <div key={tx.hash} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">From:</span>
                        <div className="font-mono text-xs break-all">
                          {tx.from}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">To:</span>
                        <div className="font-mono text-xs break-all">
                          {tx.to || "Contract Creation"}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Value:</span>
                        <div className="font-mono text-green-600 font-semibold">
                          {parseFloat(tx.valueEth).toFixed(6)} ETH
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-600 text-xs">Hash:</span>
                        <div className="font-mono text-xs text-gray-500 break-all">
                          {tx.hash}
                        </div>
                      </div>
                      <button
                        onClick={() => fetchTransactionDetails(tx.hash)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTx && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold">Hash:</span>
                    <div className="font-mono break-all">{selectedTx.hash}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedTx.status === 'success' ? 'bg-green-100 text-green-800' : 
                      selectedTx.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTx.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">From:</span>
                    <div className="font-mono break-all">{selectedTx.from}</div>
                  </div>
                  <div>
                    <span className="font-semibold">To:</span>
                    <div className="font-mono break-all">{selectedTx.to || "Contract Creation"}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Value:</span>
                    <div className="font-mono text-green-600">{selectedTx.valueEth} ETH</div>
                  </div>
                  <div>
                    <span className="font-semibold">Gas Price:</span>
                    <div>{selectedTx.gasPriceGwei}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Gas Used:</span>
                    <div>{selectedTx.gasUsed}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Transaction Fee:</span>
                    <div className="font-mono">{selectedTx.transactionFee} ETH</div>
                  </div>
                  <div>
                    <span className="font-semibold">Block Number:</span>
                    <div>{selectedTx.blockNumber}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Confirmations:</span>
                    <div>{selectedTx.confirmations}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Info Modal */}
        {showWalletInfo && walletInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Wallet Information</h3>
                  <button
                    onClick={() => setShowWalletInfo(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">Address:</span>
                    <div className="font-mono break-all text-sm">{walletInfo.address}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Balance:</span>
                    <div className="font-mono text-green-600 text-lg">{walletInfo.balanceEth} ETH</div>
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      walletInfo.isContract ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {walletInfo.isContract ? 'Contract' : 'EOA'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Recent Transactions ({walletInfo.transactionCount}):</span>
                    <div className="mt-2 space-y-2">
                      {walletInfo.recentTransactions.map((tx) => (
                        <div key={tx.hash} className="border border-gray-200 rounded p-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded ${
                              tx.type === 'outgoing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {tx.type}
                            </span>
                            <span className="font-mono">{tx.valueEth} ETH</span>
                          </div>
                          <div className="font-mono break-all mt-1">{tx.hash}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
