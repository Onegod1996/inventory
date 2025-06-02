import React, { useState } from 'react';
import { PlusCircle, FileCheck, CheckCircle2, X, Upload } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { IncomingArticle } from '../types';
import { formatCurrency, formatDate, calculateUnitPriceWithoutGst } from '../lib/utils';

import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import { Badge } from '../components/ui/Badge';

const IncomingArticlesPage: React.FC = () => {
  const { vendors, parts, incomingArticles, addIncomingArticle, updateIncomingArticle } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);

  // Form state
  const [partNumber, setPartNumber] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customDuty, setCustomDuty] = useState(0);
  const [sws, setSws] = useState(0);
  const [gst, setGst] = useState(0);
  const [carrierCharges, setCarrierCharges] = useState(0);

  // QC state
  const [articlesCounted, setArticlesCounted] = useState(false);
  const [finalAcceptedQuantity, setFinalAcceptedQuantity] = useState(0);
  const [qcComplete, setQcComplete] = useState(false);
  const [qcRemarks, setQcRemarks] = useState('');
  const [qcChecklistUrl, setQcChecklistUrl] = useState('');

  // Calculated price
  const [unitPriceWithoutGst, setUnitPriceWithoutGst] = useState(0);

  // Reset form
  const resetForm = () => {
    setPartNumber('');
    setVendorId('');
    setQuantity(0);
    setUnitPrice(0);
    setCustomDuty(0);
    setSws(0);
    setGst(0);
    setCarrierCharges(0);
    setUnitPriceWithoutGst(0);
    setArticlesCounted(false);
    setFinalAcceptedQuantity(0);
    setQcComplete(false);
    setQcRemarks('');
    setQcChecklistUrl('');
    setEditingArticle(null);
  };

  // Open form with an existing article for editing/verification
  const openArticleForm = (article: IncomingArticle) => {
    setEditingArticle(article.id);
    setPartNumber(article.partNumber);
    setVendorId(article.vendorId);
    setQuantity(article.quantity);
    setUnitPrice(article.unitPrice);
    setCustomDuty(article.customDuty);
    setSws(article.sws);
    setGst(article.gst);
    setCarrierCharges(article.carrierCharges);
    setUnitPriceWithoutGst(article.unitPriceWithoutGst);
    setArticlesCounted(article.status === 'counted' || article.status === 'qcComplete' || article.status === 'approved');
    setFinalAcceptedQuantity(article.finalAcceptedQuantity || article.quantity);
    setQcComplete(article.status === 'qcComplete' || article.status === 'approved');
    setQcRemarks(article.qcRemarks || '');
    setQcChecklistUrl(article.qcChecklistUrl || '');
    setIsFormOpen(true);
  };

  // Calculate unit price without GST
  const handleCalculateUnitPrice = () => {
    const calculatedPrice = calculateUnitPriceWithoutGst(
      unitPrice,
      customDuty,
      sws,
      gst,
      carrierCharges
    );
    setUnitPriceWithoutGst(calculatedPrice);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingArticle) {
      // Update existing article with verification status
      let newStatus = 'pending';
      if (articlesCounted && qcComplete) {
        newStatus = 'qcComplete';
      } else if (articlesCounted) {
        newStatus = 'counted';
      }
      
      updateIncomingArticle(editingArticle, {
        status: newStatus as IncomingArticle['status'],
        finalAcceptedQuantity: articlesCounted ? finalAcceptedQuantity : undefined,
        qcRemarks: qcComplete ? qcRemarks : undefined,
        qcChecklistUrl: qcComplete && qcChecklistUrl ? qcChecklistUrl : undefined,
      });
    } else {
      // Create new incoming article
      addIncomingArticle({
        partNumber,
        vendorId,
        quantity,
        unitPrice,
        customDuty,
        sws,
        gst,
        carrierCharges,
        unitPriceWithoutGst,
      });
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  // Handle approve inventory update
  const handleApprove = (id: string) => {
    updateIncomingArticle(id, { status: 'approved' });
  };

  // Get status badge
  const getStatusBadge = (status: IncomingArticle['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'counted':
        return <Badge variant="primary">Articles Counted</Badge>;
      case 'qcComplete':
        return <Badge variant="secondary">QC Complete</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Incoming Articles"
        description="Manage incoming inventory articles and their verification process"
        actionText={isFormOpen ? 'Cancel' : 'Add New Article'}
        actionIcon={isFormOpen ? <X size={16} /> : <PlusCircle size={16} />}
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
              {editingArticle ? 'Verify Incoming Article' : 'Create Incoming Article'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Part Number"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  disabled={!!editingArticle}
                  required
                  fullWidth
                />
                
                <Select
                  label="Vendor"
                  value={vendorId}
                  onChange={setVendorId}
                  disabled={!!editingArticle}
                  required
                  fullWidth
                  options={[
                    { value: '', label: 'Select a vendor', disabled: true },
                    ...vendors.map(vendor => ({
                      value: vendor.id,
                      label: vendor.name,
                    })),
                  ]}
                />
                
                <Input
                  label="Quantity"
                  type="number"
                  value={quantity.toString()}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="1"
                  fullWidth
                />
                
                <Input
                  label="Unit Price"
                  type="number"
                  value={unitPrice.toString()}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="0"
                  step="0.01"
                  fullWidth
                />
                
                <Input
                  label="Custom Duty"
                  type="number"
                  value={customDuty.toString()}
                  onChange={(e) => setCustomDuty(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="0"
                  step="0.01"
                  fullWidth
                />
                
                <Input
                  label="SWS"
                  type="number"
                  value={sws.toString()}
                  onChange={(e) => setSws(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="0"
                  step="0.01"
                  fullWidth
                />
                
                <Input
                  label="GST"
                  type="number"
                  value={gst.toString()}
                  onChange={(e) => setGst(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="0"
                  step="0.01"
                  fullWidth
                />
                
                <Input
                  label="Carrier Charges"
                  type="number"
                  value={carrierCharges.toString()}
                  onChange={(e) => setCarrierCharges(Number(e.target.value))}
                  disabled={!!editingArticle}
                  required
                  min="0"
                  step="0.01"
                  fullWidth
                />
              </div>
              
              {!editingArticle && (
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCalculateUnitPrice}
                  >
                    Calculate Unit Price without GST
                  </Button>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700">
                      Unit Price without GST: {formatCurrency(unitPriceWithoutGst)}
                    </p>
                  </div>
                </div>
              )}

              {editingArticle && (
                <div className="mt-6 border-t border-neutral-200 pt-6">
                  <h3 className="mb-4 text-lg font-medium">Verification Process</h3>
                  
                  <div className="space-y-4">
                    <Checkbox
                      label="Articles Counted"
                      checked={articlesCounted}
                      onChange={setArticlesCounted}
                    />
                    
                    {articlesCounted && (
                      <Input
                        label="Final Accepted Quantity"
                        type="number"
                        value={finalAcceptedQuantity.toString()}
                        onChange={(e) => setFinalAcceptedQuantity(Number(e.target.value))}
                        required
                        min="0"
                        max={quantity.toString()}
                        fullWidth
                      />
                    )}
                    
                    <Checkbox
                      label="QC Complete"
                      checked={qcComplete}
                      onChange={setQcComplete}
                    />
                    
                    {qcComplete && (
                      <>
                        <Input
                          label="QC Remarks"
                          value={qcRemarks}
                          onChange={(e) => setQcRemarks(e.target.value)}
                          required
                          fullWidth
                        />
                        
                        <Input
                          label="QC Checklist URL (Optional)"
                          value={qcChecklistUrl}
                          onChange={(e) => setQcChecklistUrl(e.target.value)}
                          fullWidth
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
              
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
                  {editingArticle ? 'Update Verification Status' : 'Create Incoming Log'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Incoming Articles Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Part Number</th>
                  <th className="table-header-cell">Vendor</th>
                  <th className="table-header-cell">Quantity</th>
                  <th className="table-header-cell">Unit Price</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {incomingArticles.map((article) => {
                  const vendor = vendors.find(v => v.id === article.vendorId);
                  return (
                    <tr key={article.id} className="table-row">
                      <td className="table-cell">
                        {formatDate(article.dateCreated, 'dd MMM yyyy')}
                      </td>
                      <td className="table-cell">{article.partNumber}</td>
                      <td className="table-cell">{vendor?.name || 'Unknown'}</td>
                      <td className="table-cell">{article.quantity}</td>
                      <td className="table-cell">{formatCurrency(article.unitPrice)}</td>
                      <td className="table-cell">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          {article.status !== 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={article.status === 'pending' ? <FileCheck size={16} /> : <CheckCircle2 size={16} />}
                              onClick={() => openArticleForm(article)}
                            >
                              {article.status === 'pending' ? 'Verify' : 'Approve'}
                            </Button>
                          )}
                          
                          {article.status === 'qcComplete' && (
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<CheckCircle2 size={16} />}
                              onClick={() => handleApprove(article.id)}
                            >
                              Approve Inventory Update
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default IncomingArticlesPage;