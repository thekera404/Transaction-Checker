import React from 'react';

interface TransactionCardProps {
  transaction: {
    hash: string;
    from: string;
    to: string | null;
    valueEth: string;
    timestamp?: number;
  };
  onViewDetails: (hash: string) => void;
  isTracked?: boolean;
}

export default function TransactionCard({ transaction, onViewDetails, isTracked = false }: TransactionCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue === 0) return '0 ETH';
    if (numValue < 0.001) return `${numValue.toFixed(8)} ETH`;
    if (numValue < 1) return `${numValue.toFixed(6)} ETH`;
    return `${numValue.toFixed(4)} ETH`;
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${
      isTracked ? 'ring-2 ring-blue-200 bg-blue-50' : ''
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="font-semibold text-gray-600">From:</span>
          <div className="font-mono text-xs break-all">
            {formatAddress(transaction.from)}
          </div>
        </div>
        <div>
          <span className="font-semibold text-gray-600">To:</span>
          <div className="font-mono text-xs break-all">
            {transaction.to ? formatAddress(transaction.to) : "Contract Creation"}
          </div>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Value:</span>
          <div className="font-mono text-green-600 font-semibold">
            {formatValue(transaction.valueEth)}
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
        <div>
          <span className="font-semibold text-gray-600 text-xs">Hash:</span>
          <div className="font-mono text-xs text-gray-500 break-all">
            {transaction.hash}
          </div>
        </div>
        <button
          onClick={() => onViewDetails(transaction.hash)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
        >
          Details
        </button>
      </div>
      {transaction.timestamp && (
        <div className="mt-2 text-xs text-gray-500">
          {new Date(transaction.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
