import { NextRequest, NextResponse } from "next/server";
import { getLatestBlockWithTxs, normalizeAddress, toEth } from "@/lib/base";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
    50
  );
  const address = searchParams.get("address");
  const filter = address ? normalizeAddress(address) : null;

  try {
    // Check if environment variable is set
    if (!process.env.BASE_MAINNET_RPC) {
      console.warn("BASE_MAINNET_RPC environment variable not set, using default");
    }

    const { blockNumberHex, blockNumberDec, transactions } =
      await getLatestBlockWithTxs();

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
        valueEth: toEth(t.value.toString()),
      }));

    return NextResponse.json({
      blockNumber: blockNumberHex,
      blockNumberDecimal: blockNumberDec,
      txs: rows,
    });
  } catch (e: any) {
    console.error("API Error:", e);
    
    // Provide more specific error messages
    let errorMessage = "Failed to fetch data";
    if (e.message?.includes("network")) {
      errorMessage = "Network error - please check your internet connection";
    } else if (e.message?.includes("timeout")) {
      errorMessage = "Request timeout - please try again";
    } else if (e.message?.includes("rate limit")) {
      errorMessage = "Rate limit exceeded - please try again later";
    } else if (e.message) {
      errorMessage = e.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
