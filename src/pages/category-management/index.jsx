import React, { useState, useMemo } from 'react';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import Button from '../../components/ui/Button';
import TransactionRow from './components/TransactionRow';
import FilterPanel from './components/FilterPanel';
import CategorySummary from './components/CategorySummary';
import BulkEditPanel from './components/BulkEditPanel';
import EmptyState from './components/EmptyState';
import { useData } from '../../context/DataContext';

const CategoryManagement = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    confidence: 'all',
    dateRange: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });

  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  
  // Use global persisted state for transactions
  const { categoryTransactions: transactions, setCategoryTransactions: setTransactions } = useData();

  // Calculate summaries based on transactions
  const categorySummaries = useMemo(() => {
    if (!transactions.length) return [];
    const summaryMap = {};
    transactions.forEach(t => {
      if (!summaryMap[t.category]) {
        summaryMap[t.category] = { category: t.category, count: 0, amount: 0, totalConf: 0 };
      }
      summaryMap[t.category].count += 1;
      summaryMap[t.category].amount += t.amount;
      summaryMap[t.category].totalConf += t.confidence;
    });

    return Object.values(summaryMap).map(s => ({
      ...s,
      accuracy: Math.round(s.totalConf / s.count)
    }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }
      if (filters.confidence !== 'all') {
        if (filters.confidence === 'high' && transaction.confidence < 80) return false;
        if (filters.confidence === 'medium' && (transaction.confidence < 60 || transaction.confidence >= 80)) return false;
        if (filters.confidence === 'low' && transaction.confidence >= 60) return false;
      }
      if (filters.search && !transaction.merchant.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filters, transactions]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      confidence: 'all',
      dateRange: 'all',
      search: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleCategoryUpdate = (transactionId, newCategory) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId ? { ...t, category: newCategory } : t
    ));
  };

  const handleTransactionSelect = (transactionId, isSelected) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === filteredTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)));
    }
  };

  const handleBulkUpdate = (category) => {
    setTransactions(prev => prev.map(t => 
      selectedTransactions.has(t.id) ? { ...t, category } : t
    ));
    setSelectedTransactions(new Set());
  };

  const handleClearSelection = () => {
    setSelectedTransactions(new Set());
  };

  return (
    <div className="min-h-screen bg-background">
      <PrimaryNavigation />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">Category Management</h1>
              <Button variant="outline" iconName="Download" iconSize={18}>Export Data</Button>
            </div>
            <p className="text-muted-foreground">Review and optimize AI-powered transaction categorization to improve accuracy</p>
          </div>

          <div className="mb-6">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-foreground">Transactions ({filteredTransactions.length})</h2>
                    {filteredTransactions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={selectedTransactions.size === filteredTransactions.length ? 'CheckSquare' : 'Square'}
                        iconSize={16}
                        onClick={handleSelectAll}
                      >
                        {selectedTransactions.size === filteredTransactions.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    )}
                  </div>
                  {selectedTransactions.size > 0 && <span className="text-sm text-muted-foreground">{selectedTransactions.size} selected</span>}
                </div>

                {filteredTransactions.length === 0 ? (
                  <EmptyState onReset={handleResetFilters} />
                ) : (
                  <div className="space-y-3">
                    {filteredTransactions.map(transaction => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        onCategoryUpdate={handleCategoryUpdate}
                        onSelect={handleTransactionSelect}
                        isSelected={selectedTransactions.has(transaction.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <CategorySummary summaries={categorySummaries} />
            </div>
          </div>
        </div>
      </main>
      <BulkEditPanel
        selectedCount={selectedTransactions.size}
        onBulkUpdate={handleBulkUpdate}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export default CategoryManagement;