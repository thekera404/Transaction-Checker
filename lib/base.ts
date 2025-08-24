import { ethers, Block, TransactionResponse } from "ethers";

const BASE_RPC = process.env.BASE_MAINNET_RPC || "https://mainnet.base.org";
const provider = new ethers.JsonRpcProvider(BASE_RPC);

/**
 * Get latest block with transactions
 */
export async function getLatestBlockWithTxs() {
  try {
    const block = await provider.getBlock("latest", true); // full txs
    if (!block) throw new Error("Failed to fetch block");

    return {
      blockNumberHex: ethers.toBeHex(block.number),
      blockNumberDec: block.number,
      transactions: block.transactions as TransactionResponse[],
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Request timeout - please try again");
      } else if (error.message.includes("network")) {
        throw new Error("Network error - please check your connection");
      } else if (error.message.includes("rate limit")) {
        throw new Error("Rate limit exceeded - please try again later");
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

