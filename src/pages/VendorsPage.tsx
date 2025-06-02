import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { Vendor } from '../types';
import { isValidEmail } from '../lib/utils';

import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const VendorsPage: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor } = useAppContext();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  
  // Reset form
  const resetForm = () => {
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
    setErrors({});
    setEditingVendor(null);
  };
  
  // Open form with an existing vendor for editing
  const openVendorForm = (vendor: Vendor) => {
    setEditingVendor(vendor.id);
    setName(vendor.name);
    setContactPerson(vendor.contactPerson);
    setEmail(vendor.email);
    setPhone(vendor.phone);
    setAddress(vendor.address);
    setIsFormOpen(true);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Vendor name is required';
    }
    
    if (!isValidEmail(email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingVendor) {
      // Update existing vendor
      updateVendor(editingVendor, {
        name,
        contactPerson,
        email,
        phone,
        address,
      });
    } else {
      // Create new vendor
      addVendor({
        name,
        contactPerson,
        email,
        phone,
        address,
      });
    }
    
    resetForm();
    setIsFormOpen(false);
  };
  
  // Handle vendor deletion
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor(id);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Vendor Management"
        description="Manage supplier information and relationships"
        actionText={isFormOpen ? 'Cancel' : 'Add New Vendor'}
        actionIcon={isFormOpen ? <X size={16} /> : <Plus size={16} />}
        onActionClick={() => {
          if (isFormOpen) {
            resetForm();
          }
          setIsFormOpen(!isFormOpen);
        }}
      />
      
      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Vendor Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                  fullWidth
                />
                
                <Input
                  label="Contact Person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                  fullWidth
                  leftIcon={<Mail size={16} />}
                />
                
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  required
                  fullWidth
                  leftIcon={<Phone size={16} />}
                />
                
                <Input
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="md:col-span-2"
                  fullWidth
                  leftIcon={<MapPin size={16} />}
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <CardTitle>{vendor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="font-medium">{vendor.contactPerson}</p>
                
                <div className="flex items-center text-sm text-neutral-600">
                  <Mail size={16} className="mr-2 text-neutral-400" />
                  <span>{vendor.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-neutral-600">
                  <Phone size={16} className="mr-2 text-neutral-400" />
                  <span>{vendor.phone}</span>
                </div>
                
                <div className="flex items-start text-sm text-neutral-600">
                  <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-neutral-400" />
                  <span>{vendor.address}</span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit size={16} />}
                    onClick={() => openVendorForm(vendor)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    className="text-error-500 hover:bg-error-50 hover:text-error-600"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default VendorsPage;