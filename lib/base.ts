import { ethers, Block, TransactionResponse } from "ethers";

// Use a more reliable Base RPC endpoint
const BASE_RPC = "https://base-mainnet.public.blastapi.io";
const provider = new ethers.JsonRpcProvider(BASE_RPC);

/**
 * Get latest block with transactions
 */
export async function getLatestBlockWithTxs() {
  try {
    console.log("Connecting to Base RPC:", BASE_RPC);
    const block = await provider.getBlock("latest", true); // full txs
    if (!block) throw new Error("Failed to fetch block");

    console.log("Successfully fetched block:", block.number);
    console.log("Block has transactions:", block.transactions.length);

    return {
      blockNumberHex: ethers.toBeHex(block.number),
      blockNumberDec: block.number,
      transactions: block.transactions as unknown as TransactionResponse[],
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Request timeout - please try again");
      } else if (error.message.includes("network")) {
        throw new Error("Network error - please check your connection");
      } else if (error.message.includes("rate limit")) {
        throw new Error("Rate limit exceeded - please try again later");
      } else if (error.message.includes("fetch")) {
        throw new Error("Failed to connect to Base network");
      }
    }
    
    throw error;
  }
}

/**
 * Normalize address
 */
export function normalizeAddress(addr: string) {
  return addr.toLowerCase();
}

/**
 * Convert wei → ETH string
 */
export function toEth(wei: string) {
  return ethers.formatEther(wei);
}

/**
 * Shorten an address for display
 */
export function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

