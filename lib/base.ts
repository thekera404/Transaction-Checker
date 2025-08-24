import { ethers, Block, TransactionResponse } from "ethers";

// Multiple RPC endpoints for better reliability
const RPC_ENDPOINTS = [
  "https://base-mainnet.public.blastapi.io",
  "https://mainnet.base.org",
  "https://base.blockpi.network/v1/rpc/public",
];

let currentRpcIndex = 0;
let provider: ethers.JsonRpcProvider;

function getNextProvider(): ethers.JsonRpcProvider {
  const rpcUrl = RPC_ENDPOINTS[currentRpcIndex];
  currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Initialize provider
provider = getNextProvider();

/**
 * Get latest block with transactions
 */
export async function getLatestBlockWithTxs() {
  let lastError: Error | null = null;
  
  // Try each RPC endpoint
  for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
    try {
      const currentProvider = getNextProvider();
      console.log(`Attempting to connect to Base RPC (attempt ${attempt + 1}):`, RPC_ENDPOINTS[attempt]);
      
      const block = await currentProvider.getBlock("latest", true); // full txs
      if (!block) throw new Error("Failed to fetch block");

      console.log("Successfully fetched block:", block.number);
      console.log("Block has transactions:", block.transactions.length);

      return {
        blockNumberHex: ethers.toBeHex(block.number),
        blockNumberDec: block.number,
        transactions: block.transactions as unknown as TransactionResponse[],
        timestamp: block.timestamp,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`RPC attempt ${attempt + 1} failed:`, lastError.message);
      
      // If this is the last attempt, throw the error
      if (attempt === RPC_ENDPOINTS.length - 1) {
        break;
      }
      
      // Wait a bit before trying the next endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // If we get here, all attempts failed
  console.error("All RPC endpoints failed. Last error:", lastError);
  
  // Provide more specific error messages
  if (lastError) {
    if (lastError.message.includes("timeout")) {
      throw new Error("Request timeout - please try again");
    } else if (lastError.message.includes("network")) {
      throw new Error("Network error - please check your connection");
    } else if (lastError.message.includes("rate limit")) {
      throw new Error("Rate limit exceeded - please try again later");
    } else if (lastError.message.includes("fetch")) {
      throw new Error("Failed to connect to Base network");
    }
  }
  
  throw lastError || new Error("Failed to fetch block data");
}

/**
 * Get a specific block by number
 */
export async function getBlockByNumber(blockNumber: number) {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
    try {
      const currentProvider = getNextProvider();
      const block = await currentProvider.getBlock(blockNumber, true);
      if (!block) throw new Error(`Block ${blockNumber} not found`);

      return {
        blockNumberHex: ethers.toBeHex(block.number),
        blockNumberDec: block.number,
        transactions: block.transactions as unknown as TransactionResponse[],
        timestamp: block.timestamp,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === RPC_ENDPOINTS.length - 1) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw lastError || new Error(`Failed to fetch block ${blockNumber}`);
}

/**
 * Get transaction details by hash
 */
export async function getTransactionByHash(txHash: string) {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
    try {
      const currentProvider = getNextProvider();
      const tx = await currentProvider.getTransaction(txHash);
      if (!tx) throw new Error(`Transaction ${txHash} not found`);

      return tx;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === RPC_ENDPOINTS.length - 1) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw lastError || new Error(`Failed to fetch transaction ${txHash}`);
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
 * Convert ETH → wei string
 */
export function toWei(eth: string) {
  return ethers.parseEther(eth).toString();
}

/**
 * Shorten an address for display
 */
export function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/**
 * Format gas price from wei to gwei
 */
export function formatGasPrice(gasPriceWei: string) {
  const gasPriceGwei = ethers.formatUnits(gasPriceWei, "gwei");
  return `${parseFloat(gasPriceGwei).toFixed(2)} Gwei`;
}

/**
 * Calculate transaction fee in ETH
 */
export function calculateTxFee(gasPrice: string, gasUsed: string) {
  const feeWei = BigInt(gasPrice) * BigInt(gasUsed);
  return ethers.formatEther(feeWei.toString());
}

/**
 * Check if address is a contract
 */
export async function isContract(address: string) {
  try {
    const currentProvider = getNextProvider();
    const code = await currentProvider.getCode(address);
    return code !== "0x";
  } catch (error) {
    console.error("Error checking if address is contract:", error);
    return false;
  }
}

