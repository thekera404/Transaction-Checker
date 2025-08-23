import { NextRequest, NextResponse } from 'next/server';
import { getLatestBlockWithTxs, normalizeAddress, toEth } from '@/lib/base';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50);
  const address = searchParams.get('address');
  const filter = address ? normalizeAddress(address) : null;

  try {
    const { blockNumberHex, blockNumberDec, transactions } = await getLatestBlockWithTxs();
    const rows = transactions
      .filter((t) => {
        if (!filter) return true;
        const from = normalizeAddress(t.from);
        const to = t.to ? normalizeAddress(t.to) : null;
        return from === filter || to === filter;
      })
      .slice(0, limit)
      .map((t) => ({
        hash: t.hash,
        from: t.from,
        to: t.to,
        valueWei: t.value,
        valueEth: toEth(t.value)
      }));

    return NextResponse.json({
      blockNumber: blockNumberHex,
      blockNumberDecimal: blockNumberDec,
      txs: rows
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
