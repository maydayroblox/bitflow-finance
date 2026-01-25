import React, { useState, useEffect } from 'react';
import { Clock, ArrowDownCircle, ArrowUpCircle, TrendingUp, DollarSign, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { formatSTX, formatTimestamp } from '../utils/formatters';

/**
 * Transaction types
 */
type TransactionType = 'deposit' | 'withdraw' | 'borrow' | 'repay';

/**
 * Transaction status
 */
type TransactionStatus = 'pending' | 'confirmed' | 'failed';

/**
 * Transaction interface
 */
interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: number;
  status: TransactionStatus;
  txHash?: string;
  blockHeight?: number;
}

/**
 * TransactionHistory Component
 * Displays user's transaction history
 */
export const TransactionHistory: React.FC = () => {
  const { address } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) {
        setTransactions([]);
        return;
      }

      setIsLoading(true);

      // In a real implementation, this would fetch from the blockchain
      // Using mock data for demonstration
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'deposit',
          amount: 1000,
          timestamp: Date.now() - 3600000,
          status: 'confirmed',
          txHash: '0x1234...5678',
          blockHeight: 12345,
        },
        {
          id: '2',
          type: 'borrow',
          amount: 500,
          timestamp: Date.now() - 7200000,
          status: 'confirmed',
          txHash: '0x2345...6789',
          blockHeight: 12340,
        },
        {
          id: '3',
          type: 'deposit',
          amount: 2000,
          timestamp: Date.now() - 86400000,
          status: 'confirmed',
          txHash: '0x3456...7890',
          blockHeight: 12300,
        },
        {
          id: '4',
          type: 'repay',
          amount: 505,
          timestamp: Date.now() - 172800000,
          status: 'confirmed',
          txHash: '0x4567...8901',
          blockHeight: 12250,
        },
        {
          id: '5',
          type: 'withdraw',
          amount: 300,
          timestamp: Date.now() - 259200000,
          status: 'confirmed',
          txHash: '0x5678...9012',
          blockHeight: 12200,
        },
      ];

      setTransactions(mockTransactions);
      setIsLoading(false);
    };

    fetchTransactions();
  }, [address]);

  // Filter transactions
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  // Get transaction icon
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle size={20} className="text-green-600" />;
      case 'withdraw':
        return <ArrowUpCircle size={20} className="text-blue-600" />;
      case 'borrow':
        return <TrendingUp size={20} className="text-purple-600" />;
      case 'repay':
        return <DollarSign size={20} className="text-orange-600" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'pending':
        return <Loader size={16} className="text-yellow-600 animate-spin" />;
    }
  };

  // Get transaction color
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-50 border-green-200';
      case 'withdraw':
        return 'bg-blue-50 border-blue-200';
      case 'borrow':
        return 'bg-purple-50 border-purple-200';
      case 'repay':
        return 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-lg">
            <Clock className="text-gray-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
            <p className="text-sm text-gray-500">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', 'deposit', 'withdraw', 'borrow', 'repay'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !address && (
        <div className="text-center py-12">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-1 font-medium">No Wallet Connected</p>
          <p className="text-sm text-gray-500">
            Connect your wallet to view transaction history
          </p>
        </div>
      )}

      {!isLoading && address && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-1 font-medium">No Transactions</p>
          <p className="text-sm text-gray-500">
            {filter === 'all' 
              ? 'Your transaction history will appear here'
              : `No ${filter} transactions found`}
          </p>
        </div>
      )}

      {/* Transaction List */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${getTransactionColor(tx.type)}`}
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 capitalize">
                        {tx.type}
                      </span>
                      {getStatusIcon(tx.status)}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{formatTimestamp(tx.timestamp)}</span>
                      {tx.blockHeight && (
                        <>
                          <span>•</span>
                          <span>Block {tx.blockHeight.toLocaleString()}</span>
                        </>
                      )}
                      {tx.txHash && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{tx.txHash}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    tx.type === 'deposit' || tx.type === 'borrow' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'borrow' ? '+' : '-'}
                    {formatSTX(tx.amount)} STX
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ ${(tx.amount * 1.5).toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total Deposits</div>
              <div className="text-sm font-bold text-green-600">
                {formatSTX(
                  transactions
                    .filter(tx => tx.type === 'deposit' && tx.status === 'confirmed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )} STX
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total Withdrawn</div>
              <div className="text-sm font-bold text-blue-600">
                {formatSTX(
                  transactions
                    .filter(tx => tx.type === 'withdraw' && tx.status === 'confirmed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )} STX
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total Borrowed</div>
              <div className="text-sm font-bold text-purple-600">
                {formatSTX(
                  transactions
                    .filter(tx => tx.type === 'borrow' && tx.status === 'confirmed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )} STX
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Total Repaid</div>
              <div className="text-sm font-bold text-orange-600">
                {formatSTX(
                  transactions
                    .filter(tx => tx.type === 'repay' && tx.status === 'confirmed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )} STX
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
