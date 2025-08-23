// lib/base.ts
import { ethers } from "ethers";

// Base Mainnet RPC URL
const BASE_RPC = "https://mainnet.base.org";

// Ethers provider
const provider = new ethers.JsonRpcProvider(BASE_RPC);

/**
 * Get the latest block with full transactions
 */
export async function getLatestBlockWithTxs() {
  const block = await provider.getBlock("latest", true); // true = include transactions
  if (!block) throw new Error("Failed to fetch block");

  return {
    blockNumberHex: ethers.toBeHex(block.number),
    blockNumberDec: block.number,
    transactions: block.transactions,
  };
}

/**
 * Normalize an Ethereum address to lowercase
 */
export function normalizeAddress(addr: string) {
  return addr.toLowerCase();
}

/**
 * Convert wei (BigInt string) to ETH
 */
export function toEth(wei: string) {
  return ethers.formatEther(wei);
}
