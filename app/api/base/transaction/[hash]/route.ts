import { NextRequest, NextResponse } from "next/server";
import { getTransactionByHash, toEth, formatGasPrice, calculateTxFee } from "@/lib/base";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { hash: string } }
) {
  const { hash } = params;

  if (!hash || !hash.startsWith("0x")) {
    return NextResponse.json(
      { error: "Invalid transaction hash" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching transaction details for hash: ${hash}`);
    
    const tx = await getTransactionByHash(hash);
    
    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Get transaction receipt for gas used
    let gasUsed = "0";
    let status = "unknown";
    try {
      const provider = new (await import("ethers")).JsonRpcProvider("https://base-mainnet.public.blastapi.io");
      const receipt = await provider.getTransactionReceipt(hash);
      if (receipt) {
        gasUsed = receipt.gasUsed.toString();
        status = receipt.status === 1 ? "success" : "failed";
      }
    } catch (error) {
      console.warn("Could not fetch transaction receipt:", error);
    }

    const txFee = calculateTxFee(tx.gasPrice?.toString() || "0", gasUsed);

    const response = {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      valueWei: tx.value.toString(),
      valueEth: toEth(tx.value.toString()),
      gasPrice: tx.gasPrice?.toString() || "0",
      gasPriceGwei: formatGasPrice(tx.gasPrice?.toString() || "0"),
      gasLimit: tx.gasLimit?.toString() || "0",
      gasUsed,
      nonce: tx.nonce,
      data: tx.data,
      status,
      transactionFee: txFee,
      blockNumber: tx.blockNumber,
      confirmations: tx.confirmations,
    };

    console.log(`Successfully fetched transaction details for ${hash}`);

    return NextResponse.json(response);
  } catch (e: any) {
    console.error("API Error:", e);
    
    let errorMessage = "Failed to fetch transaction";
    if (e.message?.includes("not found")) {
      errorMessage = "Transaction not found";
    } else if (e.message?.includes("network")) {
      errorMessage = "Network error - please check your connection";
    } else if (e.message?.includes("timeout")) {
      errorMessage = "Request timeout - please try again";
    } else if (e.message) {
      errorMessage = e.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
