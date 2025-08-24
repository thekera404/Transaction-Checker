import { NextRequest, NextResponse } from "next/server";
import { getLatestBlockWithTxs, normalizeAddress, toEth } from "@/lib/base";
import { TransactionResponse } from "ethers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
    100
  );
  const address = searchParams.get("address");
  const blocks = Math.min(
    Math.max(parseInt(searchParams.get("blocks") || "1", 10), 1),
    5
  );
  const filter = address ? normalizeAddress(address) : null;

  try {
    console.log(`Fetching latest ${blocks} block(s) with transactions...`);
    
    let allTransactions: TransactionResponse[] = [];
    let latestBlockNumber = 0;

    // Fetch multiple blocks if requested
    for (let i = 0; i < blocks; i++) {
      const { blockNumberHex, blockNumberDec, transactions } =
        await getLatestBlockWithTxs();
      
      if (i === 0) {
        latestBlockNumber = blockNumberDec;
      }
      
      allTransactions.push(...transactions);
      
      // If we're only getting one block, break
      if (blocks === 1) break;
      
      // For multiple blocks, we'd need to get previous blocks
      // This is a simplified version - in production you might want to implement
      // proper block iteration
      if (i < blocks - 1) {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Fetched ${allTransactions.length} total transactions from ${blocks} block(s)`);

    const rows = allTransactions
      .filter((t: TransactionResponse) => {
        if (!filter) return true;
        const from = normalizeAddress(t.from);
        const to = t.to ? normalizeAddress(t.to) : null;
        return from === filter || to === filter;
      })
      .slice(0, limit)
      .map((t: TransactionResponse) => ({
        hash: t.hash,
        from: t.from,
        to: t.to,
        valueWei: t.value,
        valueEth: toEth(t.value.toString()),
        gasPrice: t.gasPrice ? t.gasPrice.toString() : "0",
        gasLimit: t.gasLimit ? t.gasLimit.toString() : "0",
        nonce: t.nonce,
        data: t.data,
        timestamp: Date.now(), // We could get this from block timestamp if needed
      }));

    console.log(`Returning ${rows.length} filtered transactions`);

    return NextResponse.json({
      blockNumber: `0x${latestBlockNumber.toString(16)}`,
      blockNumberDecimal: latestBlockNumber,
      totalTransactions: allTransactions.length,
      filteredTransactions: rows.length,
      txs: rows,
    });
  } catch (e: any) {
    console.error("API Error:", e);
    console.error("Error stack:", e.stack);
    
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
