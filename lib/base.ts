import { ethers } from "ethers";

const BASE_RPC = process.env.BASE_MAINNET_RPC || "https://mainnet.base.org";
const provider = new ethers.JsonRpcProvider(BASE_RPC);

/**
 * Get latest block with transactions
 */
export async function getLatestBlockWithTxs() {
  const block = await provider.getBlock("latest", true); // full txs
  if (!block) throw new Error("Failed to fetch block");

  return {
    blockNumberHex: ethers.toBeHex(block.number),
    blockNumberDec: block.number,
    transactions: block.transactions,
  };
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

