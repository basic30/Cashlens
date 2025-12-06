import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import SubscriptionCard from './components/SubscriptionCard';
import SummaryPanel from './components/SummaryPanel';
import FilterBar from './components/FilterBar';
import HiddenSubscriptionAlert from './components/HiddenSubscriptionAlert';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import SubscriptionDetailsModal from './components/SubscriptionDetailsModal';
import Icon from '../../components/AppIcon';
import { useData } from '../../context/DataContext';

const SubscriptionTracker = () => {
  // Use data from global context
  const { subscriptions, setSubscriptions } = useData();

  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    sortBy: 'amount-desc'
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (id, newStatus) => {
    setSubscriptions(prev =>
      prev?.map(sub =>
        sub?.id === id ? { ...sub, status: newStatus } : sub
      )
    );
  };

  const handleAddSubscription = (newSubscription) => {
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setIsDetailsModalOpen(true);
  };

  const filteredAndSortedSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      result = result?.filter(sub =>
        sub?.name?.toLowerCase()?.includes(query) ||
        sub?.category?.toLowerCase()?.includes(query)
      );
    }

    if (filters?.status !== 'all') {
      result = result?.filter(sub => sub?.status === filters?.status);
    }

    result?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'amount-desc':
          return b?.amount - a?.amount;
        case 'amount-asc':
          return a?.amount - b?.amount;
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'date-asc':
          return new Date(a.nextPayment) - new Date(b.nextPayment);
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, filters]);

  const summary = useMemo(() => {
    const activeSubscriptions = subscriptions?.filter(sub => sub?.status === 'active');
    const unusedSubscriptions = subscriptions?.filter(sub => sub?.status === 'unused');
    
    const totalMonthlyCost = activeSubscriptions?.reduce((sum, sub) => {
      const monthlyCost = sub?.frequency === 'monthly' ? sub?.amount :
                         sub?.frequency === 'quarterly' ? sub?.amount / 3 :
                         sub?.amount / 12;
      return sum + monthlyCost;
    }, 0);

    const potentialSavings = unusedSubscriptions?.reduce((sum, sub) => {
      const monthlyCost = sub?.frequency === 'monthly' ? sub?.amount :
                         sub?.frequency === 'quarterly' ? sub?.amount / 3 :
                         sub?.amount / 12;
      return sum + monthlyCost;
    }, 0);

    const annualSpending = totalMonthlyCost * 12;

    return {
      totalMonthlyCost: Math.round(totalMonthlyCost),
      activeCount: activeSubscriptions?.length,
      totalCount: subscriptions?.length,
      potentialSavings: Math.round(potentialSavings),
      annualSpending: Math.round(annualSpending),
      monthlyTrend: 5.2,
      yearlyTrend: -8.5
    };
  }, [subscriptions]);

  const unusedSubscriptions = subscriptions?.filter(sub => 
    sub?.status === 'unused' || (sub?.status === 'active' && sub?.usagePercentage < 40)
  );

  return (
    <>
      <Helmet>
        <title>Subscription Tracker - CashLens</title>
        <meta name="description" content="Track and manage your recurring subscriptions with AI-powered insights and cost optimization recommendations" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <PrimaryNavigation />

        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="RefreshCw" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Subscription Tracker</h1>
                  <p className="text-muted-foreground">Manage recurring payments and optimize your spending</p>
                </div>
              </div>
            </div>

            <SummaryPanel summary={summary} />

            <HiddenSubscriptionAlert 
              unusedSubscriptions={unusedSubscriptions}
              onViewDetails={() => handleFilterChange('status', 'unused')}
            />

            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onAddSubscription={() => setIsAddModalOpen(true)}
            />

            {filteredAndSortedSubscriptions?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No subscriptions found</h3>
                <p className="text-muted-foreground mb-6">
                  {filters?.searchQuery || filters?.status !== 'all' ?'Try adjusting your filters or search query' :'Add your first subscription to start tracking'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Plus" size={20} />
                  <span>Add Subscription</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedSubscriptions?.map(subscription => (
                  <SubscriptionCard
                    key={subscription?.id}
                    subscription={subscription}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <AddSubscriptionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSubscription}
        />

        <SubscriptionDetailsModal
          isOpen={isDetailsModalOpen}
          subscription={selectedSubscription}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedSubscription(null);
          }}
          onStatusChange={handleStatusChange}
        />
      </div>
    </>
  );
};

export default SubscriptionTracker;