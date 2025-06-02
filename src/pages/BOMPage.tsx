import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAppContext } from '../context/AppContext';

interface BOMItem {
  id: string;
  name: string;
  parts: {
    partId: string;
    quantity: number;
  }[];
}

const BOMPage: React.FC = () => {
  const { parts } = useAppContext();
  const [activeTab, setActiveTab] = useState<'production' | 'spare' | 'addon'>('production');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BOMItem | null>(null);
  
  // State for new BOM creation
  const [newBOMName, setNewBOMName] = useState('');
  const [selectedParts, setSelectedParts] = useState<{ partId: string; quantity: number }[]>([]);
  
  const handleAddPart = () => {
    const partId = (document.getElementById('partSelect') as HTMLSelectElement).value;
    const quantity = parseInt((document.getElementById('quantityInput') as HTMLInputElement).value);
    
    if (partId && quantity > 0) {
      setSelectedParts([...selectedParts, { partId, quantity }]);
    }
  };
  
  const handleSaveBOM = () => {
    // Save BOM logic here
    console.log('Saving BOM:', {
      name: newBOMName,
      parts: selectedParts,
      type: activeTab
    });
    
    // Reset form
    setNewBOMName('');
    setSelectedParts([]);
    setIsEditing(false);
  };

  return (
    <Layout>
      <PageHeader
        title="BOM Management"
        description="Manage Bill of Materials for different product configurations"
        actionText={isEditing ? 'Cancel' : 'Create New BOM'}
        actionIcon={isEditing ? <X size={16} /> : <Plus size={16} />}
        onActionClick={() => setIsEditing(!isEditing)}
      />
      
      <div className="mb-6 flex space-x-2">
        <Button
          variant={activeTab === 'production' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('production')}
        >
          Production
        </Button>
        <Button
          variant={activeTab === 'spare' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('spare')}
        >
          Spare
        </Button>
        <Button
          variant={activeTab === 'addon' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('addon')}
        >
          Add-on
        </Button>
      </div>
      
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New BOM Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                label="BOM Name"
                value={newBOMName}
                onChange={(e) => setNewBOMName(e.target.value)}
                placeholder="Enter BOM configuration name"
                fullWidth
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Select
                  id="partSelect"
                  label="Select Part"
                  options={parts
                    .filter(part => part.category === activeTab)
                    .map(part => ({
                      value: part.id,
                      label: `${part.partNumber} - ${part.name}`
                    }))}
                  fullWidth
                />
                
                <Input
                  id="quantityInput"
                  type="number"
                  label="Quantity"
                  min="1"
                  defaultValue="1"
                  fullWidth
                />
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleAddPart}
                    leftIcon={<Plus size={16} />}
                    fullWidth
                  >
                    Add Part
                  </Button>
                </div>
              </div>
              
              {selectedParts.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-medium">Selected Parts</h3>
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
                        {selectedParts.map((selectedPart, index) => {
                          const part = parts.find(p => p.id === selectedPart.partId);
                          return (
                            <tr key={index} className="table-row">
                              <td className="table-cell">{part?.partNumber}</td>
                              <td className="table-cell">{part?.name}</td>
                              <td className="table-cell">{selectedPart.quantity}</td>
                              <td className="table-cell">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedParts(selectedParts.filter((_, i) => i !== index));
                                  }}
                                  leftIcon={<Trash2 size={16} />}
                                  className="text-error-500 hover:text-error-600"
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNewBOMName('');
                    setSelectedParts([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveBOM}
                  leftIcon={<Save size={16} />}
                  disabled={!newBOMName || selectedParts.length === 0}
                >
                  Save BOM Configuration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>BOM Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Parts Count</th>
                    <th className="table-header-cell">Last Modified</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  <tr>
                    <td colSpan={4} className="table-cell text-center py-8 text-neutral-500">
                      No BOM configurations found. Click "Create New BOM" to add one.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default BOMPage;