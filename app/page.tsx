"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/base/latest?limit=5")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <main className="p-6 font-mono">
      <h1 className="text-2xl font-bold mb-4">🔵 Base Transaction Checker</h1>
      {!data && <p>Loading latest transactions…</p>}
      {data && (
        <div>
          <p className="mb-2">Block: {data.blockNumberDecimal}</p>
          <ul className="space-y-2">
            {data.txs.map((tx: any) => (
              <li key={tx.hash} className="border-b pb-2">
                <div>
                  <b>From:</b> {tx.from}
                </div>
                <div>
                  <b>To:</b> {tx.to}
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
