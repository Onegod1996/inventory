import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';

const InventoryManagementPage: React.FC = () => {
  const { parts, addPart, updatePart } = useAppContext();
  const [newPart, setNewPart] = useState({
    partNumber: '',
    name: '',
    category: 'production',
    currentStock: 0,
    minStock: 0,
    unitPrice: 0,
  });
  const [bomItems, setBomItems] = useState<{ partId: string; quantity: number }[]>([]);
  const [bomItem, setBomItem] = useState({ partId: '', quantity: 1 });

  const handleAddPart = () => {
    addPart({
      ...newPart,
      id: `part-${Date.now()}`,
    });
    setNewPart({
      partNumber: '',
      name: '',
      category: 'production',
      currentStock: 0,
      minStock: 0,
      unitPrice: 0,
    });
  };

  const handleAddToBom = () => {
    if (!bomItem.partId) return;
    
    setBomItems([...bomItems, bomItem]);
    setBomItem({ partId: '', quantity: 1 });
  };

  return (
    <Layout>
      <PageHeader
        title="Inventory Management"
        description="Add inventory items and define kits for production"
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Add New Items */}
        <Card>
          <CardHeader>
            <CardTitle>Add Inventory Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Part Number"
                value={newPart.partNumber}
                onChange={(e) => setNewPart({ ...newPart, partNumber: e.target.value })}
                placeholder="DRN-001"
              />
              <Input
                label="Item Name"
                value={newPart.name}
                onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                placeholder="Drone Frame"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Current Stock"
                  type="number"
                  value={newPart.currentStock}
                  onChange={(e) => setNewPart({ ...newPart, currentStock: Number(e.target.value) })}
                />
                <Input
                  label="Min Stock"
                  type="number"
                  value={newPart.minStock}
                  onChange={(e) => setNewPart({ ...newPart, minStock: Number(e.target.value) })}
                />
              </div>
              <Input
                label="Unit Price"
                type="number"
                value={newPart.unitPrice}
                onChange={(e) => setNewPart({ ...newPart, unitPrice: Number(e.target.value) })}
                step="0.01"
              />
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newPart.category}
                  onChange={(e) => setNewPart({ ...newPart, category: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="production">Production Part</option>
                  <option value="spare">Spare Part</option>
                  <option value="addon">Add-on Part</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddPart} className="w-full">
              Add to Inventory
            </Button>
          </CardFooter>
        </Card>
        
        {/* Right Column - BOM Management */}
        <Card>
          <CardHeader>
            <CardTitle>Kit Definition (BOM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Select Part</label>
                  <select
                    value={bomItem.partId}
                    onChange={(e) => setBomItem({ ...bomItem, partId: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a part</option>
                    {parts.map(part => (
                      <option key={part.id} value={part.id}>
                        {part.partNumber} - {part.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    label="Qty per Kit"
                    type="number"
                    value={bomItem.quantity}
                    onChange={(e) => setBomItem({ ...bomItem, quantity: Number(e.target.value) })}
                    min="1"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddToBom} variant="outline" className="w-full">
                Add to Kit Definition
              </Button>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Current Kit Components</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Part Number</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomItems.map((item, index) => {
                      const part = parts.find(p => p.id === item.partId);
                      return part ? (
                        <TableRow key={index}>
                          <TableCell>{part.partNumber}</TableCell>
                          <TableCell>{part.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Button 
                              variant="error" 
                              size="sm"
                              onClick={() => setBomItems(bomItems.filter((_, i) => i !== index))}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : null;
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="primary" 
              className="w-full"
              disabled={bomItems.length === 0}
            >
              Save Kit Definition
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default InventoryManagementPage;