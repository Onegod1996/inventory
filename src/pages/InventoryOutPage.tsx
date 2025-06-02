import React, { useState } from 'react';
import { Search, CheckSquare, XSquare, ArrowRight } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { mockProductionBOM } from '../data/mockData';
import { InventoryOutItem } from '../types';

import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';

const InventoryOutPage: React.FC = () => {
  const { parts, addInventoryOut } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<'production' | 'spare'>('production');
  
  // Step 1 - Select SKU
  const [selectedSku, setSelectedSku] = useState('drone-standard');
  
  // Step 2 - Select Components
  const [selectedItems, setSelectedItems] = useState<InventoryOutItem[]>([]);
  
  // Step 3 - Order Details
  const [orderNo, setOrderNo] = useState('');
  const [clientName, setClientName] = useState('');
  const [droneSerialNo, setDroneSerialNo] = useState('');
  const [batterySerialNo, setBatterySerialNo] = useState('');
  
  // Reset form
  const resetForm = () => {
    setStep(1);
    setCategory('production');
    setSelectedSku('drone-standard');
    setSelectedItems([]);
    setOrderNo('');
    setClientName('');
    setDroneSerialNo('');
    setBatterySerialNo('');
  };
  
  // Load components based on selected SKU
  const loadComponents = () => {
    if (category === 'production') {
      // For production SKU, load all components from the BOM
      const items = mockProductionBOM.map(item => {
        const part = parts.find(p => p.id === item.partId);
        return {
          partId: item.partId,
          partNumber: part?.partNumber || '',
          quantity: item.quantity
        };
      });
      setSelectedItems(items);
    } else {
      // For spare parts, start with an empty selection
      setSelectedItems([]);
    }
    setStep(2);
  };
  
  // Toggle item selection
  const toggleItemSelection = (partId: string) => {
    setSelectedItems(prev => 
      prev.filter(item => item.partId !== partId)
    );
  };
  
  // Add spare part to selection
  const addSparePart = (partId: string, quantity: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    
    setSelectedItems(prev => [
      ...prev,
      {
        partId: part.id,
        partNumber: part.partNumber,
        quantity
      }
    ]);
  };
  
  // Handle final submission
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    
    addInventoryOut({
      orderNo,
      clientName,
      droneSerialNo: category === 'production' ? droneSerialNo : undefined,
      batterySerialNo: category === 'production' ? batterySerialNo : undefined,
      items: selectedItems
    });
    
    alert('Inventory out processed successfully');
    resetForm();
  };
  
  return (
    <Layout>
      <PageHeader
        title="Inventory Out"
        description="Process inventory dispatch for orders and internal use"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Process Inventory Out</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="mb-4">
                  <label className="label mb-2">Category</label>
                  <div className="flex space-x-4">
                    <div 
                      className={`cursor-pointer rounded-lg p-4 border ${
                        category === 'production' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200'
                      }`}
                      onClick={() => setCategory('production')}
                    >
                      <h3 className="font-medium">Production SKU</h3>
                      <p className="text-sm text-neutral-500">Complete drone or assembly</p>
                    </div>
                    <div 
                      className={`cursor-pointer rounded-lg p-4 border ${
                        category === 'spare' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-neutral-200'
                      }`}
                      onClick={() => setCategory('spare')}
                    >
                      <h3 className="font-medium">Spare Parts</h3>
                      <p className="text-sm text-neutral-500">Individual components</p>
                    </div>
                  </div>
                </div>
                
                {category === 'production' && (
                  <Select
                    label="Select SKU"
                    value={selectedSku}
                    onChange={setSelectedSku}
                    fullWidth
                    options={[
                      { value: 'drone-standard', label: 'Standard Drone Package' },
                      { value: 'drone-pro', label: 'Pro Drone Package with Camera' },
                    ]}
                  />
                )}
                
                {category === 'spare' && (
                  <div>
                    <p className="text-sm text-neutral-500 mb-4">
                      You'll be able to select specific spare parts in the next step
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={loadComponents}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h3 className="mb-4 font-medium text-lg">Select Components</h3>
              
              {category === 'production' && (
                <div className="mb-6">
                  <p className="text-sm text-neutral-500 mb-4">
                    All components for {selectedSku === 'drone-standard' ? 'Standard Drone Package' : 'Pro Drone Package'} are selected by default. Deselect any components that should not be included.
                  </p>
                </div>
              )}
              
              {category === 'spare' && (
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Input
                      placeholder="Search parts..."
                      fullWidth
                      leftIcon={<Search size={16} />}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-500">Select parts to add</p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {parts.filter(part => part.category === 'spare').map(part => (
                        <div 
                          key={part.id} 
                          className="flex items-center justify-between rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                          onClick={() => {
                            const quantity = prompt(`Enter quantity for ${part.name}:`, '1');
                            if (quantity && Number(quantity) > 0) {
                              addSparePart(part.id, Number(quantity));
                            }
                          }}
                        >
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-xs text-neutral-500">{part.partNumber}</p>
                          </div>
                          <span className="text-sm font-medium text-success-600">
                            {part.currentStock} in stock
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Part Number</th>
                      <th className="table-header-cell">Name</th>
                      <th className="table-header-cell">Quantity</th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {selectedItems.map((item) => {
                      const part = parts.find(p => p.id === item.partId);
                      return (
                        <tr key={item.partId} className="table-row">
                          <td className="table-cell">{item.partNumber}</td>
                          <td className="table-cell">{part?.name || 'Unknown'}</td>
                          <td className="table-cell">{item.quantity}</td>
                          <td className="table-cell">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<XSquare size={16} className="text-error-500" />}
                              className="text-error-500 hover:bg-error-50"
                              onClick={() => toggleItemSelection(item.partId)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {selectedItems.length === 0 && (
                      <tr>
                        <td colSpan={4} className="table-cell text-center py-8 text-neutral-500">
                          No items selected
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(3)}
                  disabled={selectedItems.length === 0}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Order No."
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  required
                  fullWidth
                />
                
                <Input
                  label="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  fullWidth
                />
                
                {category === 'production' && (
                  <>
                    <Input
                      label="Drone Serial No."
                      value={droneSerialNo}
                      onChange={(e) => setDroneSerialNo(e.target.value)}
                      required
                      fullWidth
                    />
                    
                    <Input
                      label="Battery Serial No."
                      value={batterySerialNo}
                      onChange={(e) => setBatterySerialNo(e.target.value)}
                      required
                      fullWidth
                    />
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!orderNo || !clientName || (category === 'production' && (!droneSerialNo || !batterySerialNo))}
                  leftIcon={<CheckSquare size={16} />}
                >
                  Process Inventory Out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default InventoryOutPage;