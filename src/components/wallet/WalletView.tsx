import { useState } from 'react';
import { Shield, Wallet, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const mockTransactions = [
  { id: 1, type: 'stake', amount: -10, date: '2026-06-13', description: 'Stake for game BB6FMO52' },
  { id: 2, type: 'win', amount: 600, date: '2026-06-12', description: 'Winning payout for game BB7XKP91' },
  { id: 3, type: 'deposit', amount: 100, date: '2026-06-10', description: 'Deposit via Telebirr' },
];

export default function WalletView() {
  const [activeTab, setActiveTab] = useState<'balance' | 'history'>('balance');

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-20 overflow-y-auto">
      {/* User Verification Header */}
      <div className="bg-bingo-indigo/60 rounded-xl p-4 border border-white/5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-0.5">Phone Number</p>
            <p className="text-lg font-bold text-white">0983989648</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">✓ Verified</span>
          </div>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div className="flex bg-bingo-indigo/40 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('balance')}
          className={cn(
            'flex-1 py-2 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2',
            activeTab === 'balance'
              ? 'bg-bingo-purple text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          )}
        >
          <Wallet size={14} />
          Balance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex-1 py-2 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2',
            activeTab === 'history'
              ? 'bg-bingo-purple text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          )}
        >
          <History size={14} />
          History
        </button>
      </div>

      {/* Balance View */}
      {activeTab === 'balance' && (
        <div className="space-y-3">
          <div className="bg-bingo-indigo/40 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Main Wallet</span>
              <ArrowUpRight size={16} className="text-bingo-emerald" />
            </div>
            <p className="text-2xl font-bold text-white">0.00</p>
            <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
          </div>

          <div className="bg-bingo-indigo/40 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Play Wallet</span>
              <ArrowDownRight size={16} className="text-bingo-orange" />
            </div>
            <p className="text-2xl font-bold text-white">10.00</p>
            <p className="text-xs text-gray-500 mt-1">For entry stakes only · Cannot withdraw</p>
          </div>
        </div>
      )}

      {/* History View */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-bingo-indigo/40 rounded-xl p-3 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  )}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight size={16} className="text-emerald-400" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                  <p className="text-[10px] text-gray-500">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    'text-sm font-bold',
                    tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </p>
                <p className="text-[10px] text-gray-500">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
