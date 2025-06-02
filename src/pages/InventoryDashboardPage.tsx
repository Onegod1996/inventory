import React, { useState } from 'react';
import { Plus, ChevronRight, Package, Truck } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { formatCurrency, calculateAvailableSKUs } from '../lib/utils';
import { mockProductionBOM, mockSpareBOM, mockAddonBOM } from '../data/mockData';

import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const InventoryDashboardPage: React.FC = () => {
  const { parts } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'production' | 'spare' | 'addon'>('production');
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  
  // Calculate available SKUs based on inventory and BOM
  const availableSkus = calculateAvailableSKUs(parts, mockProductionBOM);
  
  // Filter parts by category
  const productionParts = parts.filter(part => part.category === 'production');
  const spareParts = parts.filter(part => part.category === 'spare');
  const addonParts = parts.filter(part => part.category === 'addon');
  
  // Get BOM based on active tab
  const getActiveBOM = () => {
    switch (activeTab) {
      case 'production':
        return mockProductionBOM;
      case 'spare':
        return mockSpareBOM;
      case 'addon':
        return mockAddonBOM;
      default:
        return mockProductionBOM;
    }
  };
  
  // Get parts based on active tab
  const getActiveParts = () => {
    switch (activeTab) {
      case 'production':
        return productionParts;
      case 'spare':
        return spareParts;
      case 'addon':
        return addonParts;
      default:
        return productionParts;
    }
  };
  
  // Handle production completion
  const handleProductionCompletion = () => {
    // In a real app, this would update the state
    alert(`${unitsCompleted} units marked as complete and ready to ship`);
    setUnitsCompleted(0);
    setShowProductionModal(false);
  };
  
  const getStockStatusClass = (current: number, min: number) => {
    if (current <= min * 0.5) return 'text-error-600';
    if (current <= min) return 'text-warning-600';
    return 'text-success-600';
  };

  return (
    <Layout>
      <PageHeader
        title="Inventory Dashboard"
        description="Monitor stock levels and production readiness"
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* SKU Counter Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Available SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-6xl font-bold text-primary-600">{availableSkus}</div>
              <p className="mt-2 text-sm text-neutral-500">Complete drones ready for production</p>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-50 rounded-b-xl border-t border-neutral-100">
            <Button
              variant="primary"
              onClick={() => setShowProductionModal(true)}
              className="w-full"
              leftIcon={<Plus size={16} />}
            >
              Add Production Completion
            </Button>
          </CardFooter>
        </Card>
        
        {/* Stock Levels Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-neutral-500">Production Parts</span>
                <span className="text-2xl font-semibold">{productionParts.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-500">Spare Parts</span>
                <span className="text-2xl font-semibold">{spareParts.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-500">Add-on Parts</span>
                <span className="text-2xl font-semibold">{addonParts.length}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-50 rounded-b-xl border-t border-neutral-100">
            <Button
              variant="ghost"
              className="w-full text-primary-600"
              rightIcon={<ChevronRight size={16} />}
            >
              View Detailed Report
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Package size={18} />}
              >
                Create New Incoming Log
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Truck size={18} />}
              >
                Process Inventory Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* BOM and Inventory Table */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Bill of Materials</CardTitle>
            <div className="mt-4 flex space-x-1 sm:mt-0">
              <Button
                variant={activeTab === 'production' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('production')}
                size="sm"
              >
                Production
              </Button>
              <Button
                variant={activeTab === 'spare' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('spare')}
                size="sm"
              >
                Spare
              </Button>
              <Button
                variant={activeTab === 'addon' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('addon')}
                size="sm"
              >
                Add-ons
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Part Number</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Current Stock</th>
                  <th className="table-header-cell">Min Stock</th>
                  <th className="table-header-cell">Unit Price</th>
                  <th className="table-header-cell">BOM Quantity</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {getActiveParts().map(part => {
                  const bomItem = getActiveBOM().find(item => item.partId === part.id);
                  return (
                    <tr key={part.id} className="table-row">
                      <td className="table-cell font-medium">{part.partNumber}</td>
                      <td className="table-cell">{part.name}</td>
                      <td className={`table-cell font-semibold ${getStockStatusClass(part.currentStock, part.minStock)}`}>
                        {part.currentStock}
                      </td>
                      <td className="table-cell">{part.minStock}</td>
                      <td className="table-cell">{formatCurrency(part.unitPrice)}</td>
                      <td className="table-cell">{bomItem ? bomItem.quantity : 'N/A'}</td>
                      <td className="table-cell">
                        {part.currentStock <= part.minStock * 0.5 ? (
                          <Badge variant="error">Critical</Badge>
                        ) : part.currentStock <= part.minStock ? (
                          <Badge variant="warning">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Production Completion Modal */}
      {showProductionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md animate-fade-in rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Add Production Completion</h2>
            
            <div className="mb-6">
              <Input
                label="Number of units ready to ship"
                type="number"
                value={unitsCompleted.toString()}
                onChange={(e) => setUnitsCompleted(Number(e.target.value))}
                required
                min="1"
                max={availableSkus.toString()}
                fullWidth
              />
              <p className="mt-2 text-xs text-neutral-500">
                Available components for up to {availableSkus} units
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowProductionModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleProductionCompletion}
                disabled={unitsCompleted <= 0 || unitsCompleted > availableSkus}
              >
                Confirm Production
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InventoryDashboardPage;