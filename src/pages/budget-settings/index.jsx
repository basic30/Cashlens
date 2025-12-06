import React from 'react';
import { Helmet } from 'react-helmet';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BudgetCategoryCard from './components/BudgetCategoryCard';
import MonthlyOverviewPanel from './components/MonthlyOverviewPanel';
import AlertConfigurationPanel from './components/AlertConfigurationPanel';
import SpendingComparisonChart from './components/SpendingComparisonChart';
import QuickPresetButtons from './components/QuickPresetButtons';
import AnomalyDetectionSettings from './components/AnomalyDetectionSettings';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useData } from '../../context/DataContext';

const BudgetSettings = () => {
  // Use data from global context
  const { 
    budgetCategories, 
    setBudgetCategories,
    notificationPreferences,
    setNotificationPreferences,
    anomalySettings,
    setAnomalySettings
  } = useData();

  const comparisonData = [
    { month: 'Aug', budget: 40000, spending: 35200 },
    { month: 'Sep', budget: 42000, spending: 38900 },
    { month: 'Oct', budget: 41000, spending: 39500 },
    { month: 'Nov', budget: 44000, spending: 35000 }
  ];

  const totalBudget = budgetCategories?.reduce((sum, cat) => sum + cat?.budgetLimit, 0);
  const totalSpending = budgetCategories?.reduce((sum, cat) => sum + cat?.currentSpending, 0);
  const projectedOverspend = Math.max(0, (totalSpending * 1.15) - totalBudget);

  const handleUpdateBudget = (category, newBudget) => {
    setBudgetCategories(prev =>
      prev?.map(cat =>
        cat?.category === category ? { ...cat, budgetLimit: newBudget } : cat
      )
    );
  };

  const handleUpdateThreshold = (category, newThreshold) => {
    setBudgetCategories(prev =>
      prev?.map(cat =>
        cat?.category === category ? { ...cat, alertThreshold: newThreshold } : cat
      )
    );
  };

  const handleUpdatePreferences = (key, value) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUpdateAnomalySettings = (key, value) => {
    setAnomalySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyPreset = (presetId, multiplier) => {
    setBudgetCategories(prev =>
      prev?.map(cat => ({
        ...cat,
        budgetLimit: Math.round(cat?.currentSpending * multiplier)
      }))
    );
  };

  const handleSaveAllSettings = () => {
    console.log('Saving budget settings:', {
      budgetCategories,
      notificationPreferences,
      anomalySettings
    });
    alert('Budget settings saved successfully!');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all budget settings to defaults?')) {
      setBudgetCategories(prev =>
        prev?.map(cat => ({
          ...cat,
          budgetLimit: Math.round(cat?.currentSpending * 1.2),
          alertThreshold: 80
        }))
      );
      setNotificationPreferences({
        push: true,
        email: true,
        sms: false,
        frequency: 'instant',
        defaultThreshold: '80',
        anomalyDetection: true,
        fraudDetection: true,
        budgetExceed: true
      });
      setAnomalySettings({
        sensitivity: 'medium',
        threshold: '200',
        unusualAmount: true,
        unusualTime: true,
        unusualMerchant: true,
        multipleTransactions: true,
        geographicAnomaly: false
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Budget Settings - CashLens</title>
        <meta name="description" content="Configure spending limits, alerts, and budget preferences for intelligent financial management" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <PrimaryNavigation />

        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Budget Settings</h1>
                <p className="text-muted-foreground">
                  Configure spending limits and alerts for proactive financial management
                </p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={handleResetToDefaults}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handleSaveAllSettings}
                >
                  Save Settings
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <MonthlyOverviewPanel
                totalBudget={totalBudget}
                totalSpending={totalSpending}
                projectedOverspend={projectedOverspend}
              />

              <QuickPresetButtons onApplyPreset={handleApplyPreset} />

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Icon name="FolderTree" size={24} color="var(--color-primary)" />
                  <h2 className="text-2xl font-semibold text-foreground">Category Budgets</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {budgetCategories?.map((category) => (
                    <BudgetCategoryCard
                      key={category?.category}
                      {...category}
                      onUpdateBudget={handleUpdateBudget}
                      onUpdateThreshold={handleUpdateThreshold}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AlertConfigurationPanel
                  notificationPreferences={notificationPreferences}
                  onUpdatePreferences={handleUpdatePreferences}
                />
                <AnomalyDetectionSettings
                  anomalySettings={anomalySettings}
                  onUpdateSettings={handleUpdateAnomalySettings}
                />
              </div>

              <SpendingComparisonChart comparisonData={comparisonData} />

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={24} color="var(--color-accent)" className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Budget Tips</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5" />
                        <span>Set realistic budgets based on your historical spending patterns</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5" />
                        <span>Enable alerts at 80% threshold to get early warnings before overspending</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5" />
                        <span>Review and adjust budgets monthly based on changing needs and income</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Icon name="Check" size={16} color="var(--color-success)" className="mt-0.5" />
                        <span>Use AI recommendations to optimize budget allocation across categories</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BudgetSettings;