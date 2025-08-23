'use client';

import { useEffect, useMemo, useState } from 'react';

type Tx = {
  hash: string;
  from: string;
  to?: string | null;
  valueEth: string;
};

type LatestResp = {
  blockNumber: string;
  blockNumberDecimal: number;
  txs: Tx[];
};

export default function Home() {
  const [address, setAddress] = useState('');
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<LatestResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (address.trim()) p.set('address', address.trim());
    if (limit) p.set('limit', String(limit));
    return p.toString();
  }, [address, limit]);

  useEffect(() => {
    let timer: any;
    const fetcher = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = '/api/base/latest' + (qs ? `?${qs}` : '');
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const js = await res.json();
        setData(js);
      } catch (err: any) {
        setError(err.message || 'Failed');
      } finally {
        setLoading(false);
      }
    };
    fetcher();
    timer = setInterval(fetcher, 5000);
    return () => clearInterval(timer);
  }, [qs]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">🔵 Base Mainnet – Live Transaction Checker</h1>
      <p className="text-gray-600 mb-6">
        Polling the latest block on Base and listing recent transactions. Optionally filter by address (from/to).
      </p>

      <div className="flex gap-3 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Filter by address (0x...)"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={50}
          className="border rounded px-3 py-2 w-28"
          value={limit}
          onChange={e => setLimit(Number(e.target.value || 10))}
        />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {data && (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Latest block: <b>#{data.blockNumberDecimal}</b> ({data.blockNumber})
          </div>
          <ul className="divide-y rounded border">
            {data.txs.map((t) => (
              <li key={t.hash} className="p-3 text-sm">
                <div className="flex justify-between">
                  <div className="font-mono">{t.hash.slice(0, 10)}…{t.hash.slice(-6)}</div>
                  <div>{t.valueEth} ETH</div>
                </div>
                <div className="text-gray-600 mt-1">
                  from <span className="font-mono">{t.from.slice(0, 8)}…{t.from.slice(-6)}</span>
                  {t.to && <> to <span className="font-mono">{t.to.slice(0, 8)}…{t.to.slice(-6)}</span></>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Farcaster Frame</h2>
        <p className="text-gray-600">
          Share the frame URL: <code>/api/frame</code>. Set <code>APP_BASE_URL</code> so it can render images.
        </p>
      </div>
    </main>
  );
}
