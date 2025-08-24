import { NextRequest, NextResponse } from "next/server";
import { getLatestBlockWithTxs, normalizeAddress, toEth, isContract } from "@/lib/base";
import { ethers } from "ethers";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = params;
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
    50
  );

  if (!address || !address.startsWith("0x")) {
    return NextResponse.json(
      { error: "Invalid wallet address" },
      { status: 400 }
    );
  }

  const normalizedAddress = normalizeAddress(address);

  try {
    console.log(`Fetching wallet information for: ${normalizedAddress}`);
    
    // Get wallet balance
    let balance = "0";
    let isContractAddress = false;
    
    try {
      const provider = new ethers.JsonRpcProvider("https://base-mainnet.public.blastapi.io");
      balance = (await provider.getBalance(normalizedAddress)).toString();
      isContractAddress = await isContract(normalizedAddress);
    } catch (error) {
      console.warn("Could not fetch wallet balance:", error);
    }

    // Get recent transactions involving this address
    const { transactions } = await getLatestBlockWithTxs();
    
    const walletTxs = transactions
      .filter((tx: any) => {
        const from = normalizeAddress(tx.from);
        const to = tx.to ? normalizeAddress(tx.to) : null;
        return from === normalizedAddress || to === normalizedAddress;
      })
      .slice(0, limit)
      .map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        valueWei: tx.value,
        valueEth: toEth(tx.value.toString()),
        type: normalizeAddress(tx.from) === normalizedAddress ? "outgoing" : "incoming",
        timestamp: Date.now(),
      }));

    const response = {
      address: normalizedAddress,
      balanceWei: balance,
      balanceEth: toEth(balance),
      isContract: isContractAddress,
      recentTransactions: walletTxs,
      transactionCount: walletTxs.length,
    };

    console.log(`Successfully fetched wallet information for ${normalizedAddress}`);

    return NextResponse.json(response);
  } catch (e: any) {
    console.error("API Error:", e);
    
    let errorMessage = "Failed to fetch wallet information";
    if (e.message?.includes("network")) {
      errorMessage = "Network error - please check your connection";
    } else if (e.message?.includes("timeout")) {
      errorMessage = "Request timeout - please try again";
    } else if (e.message) {
      errorMessage = e.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
