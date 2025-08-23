import { getLatestBlockWithTxs, short, toEth } from '@/lib/base';

export const dynamic = 'force-dynamic';

function svgify(rows: { hash: string; from: string; to?: string | null; value: string }[], block: number) {
  const width = 1200;
  const height = 630;
  const lineHeight = 36;
  const startY = 160;

  const lines = rows.slice(0, 10).map((t, i) => {
    const y = startY + i * lineHeight;
    const val = toEth(t.value);
    return `<text x="60" y="${y}" font-size="26" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#111827">
      ${i+1}. ${short(t.hash)}  ${val} ETH  ${short(t.from)}${t.to ? ' → ' + short(t.to) : ''}
    </text>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eef2ff"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="60" y="80" font-size="44" font-weight="700" font-family="Inter, system-ui, -apple-system, Segoe UI" fill="#111827">
    🔵 Base Live Transactions
  </text>
  <text x="60" y="120" font-size="24" font-family="Inter, system-ui, -apple-system, Segoe UI" fill="#374151">
    Latest block: #${block}
  </text>
  ${lines || '<text x="60" y="180" font-size="26" fill="#111827">No transactions found.</text>'}
  <text x="60" y="${height - 40}" font-size="20" fill="#6b7280">Refresh to update • Powered by Base RPC</text>
</svg>`;
}

export async function GET() {
  try {
    const { blockNumberDec, transactions } = await getLatestBlockWithTxs();
    const svg = svgify(transactions, blockNumberDec);
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
  } catch (e: any) {
    const fallback = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'><text x='40' y='80'>Error: ${String(e?.message || 'failed')}</text></svg>`;
    return new Response(fallback, { headers: { 'Content-Type': 'image/svg+xml' }, status: 500 });
  }
}
