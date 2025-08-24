"use client";

import { useEffect, useState } from "react";

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  valueWei: string;
  valueEth: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/base/latest?limit=5");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="p-6 font-mono">
      <h1 className="text-2xl font-bold mb-4">🔵 Base Transaction Checker</h1>
      
      {loading && <p>Loading latest transactions…</p>}
      
      {error && (
        <div className="text-red-600 mb-4">
          <p>Error: {error}</p>
          <p>Please check your environment variables and try again.</p>
        </div>
      )}
      
      {data && !error && (
        <div>
          <p className="mb-2">Block: {data.blockNumberDecimal}</p>
          <ul className="space-y-2">
            {data.txs.map((tx: Transaction) => (
              <li key={tx.hash} className="border-b pb-2">
                <div>
                  <b>From:</b> {tx.from}
                </div>
                <div>
                  <b>To:</b> {tx.to || "Contract Creation"}
                </div>
                <div>
                  <b>Value:</b> {tx.valueEth} ETH
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
