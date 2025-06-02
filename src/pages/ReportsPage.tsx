import React, { useState } from 'react';
import { Calendar, FileText, Download, ExternalLink } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { ReportType } from '../types';

import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const ReportsPage: React.FC = () => {
  const { incomingArticles, inventoryOut, vendors } = useAppContext();
  
  const [reportType, setReportType] = useState<ReportType>('weekly-inventory-out');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // Generate report data based on selected type and date range
  const generateReportData = () => {
    if (reportType === 'weekly-inventory-out') {
      const filteredItems = inventoryOut.filter(item => {
        const itemDate = new Date(item.dateOut);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
      
      return (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Order No.</th>
                <th className="table-header-cell">Client</th>
                <th className="table-header-cell">Drone S/N</th>
                <th className="table-header-cell">Items</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell">{formatDate(item.dateOut, 'dd MMM yyyy')}</td>
                    <td className="table-cell">{item.orderNo}</td>
                    <td className="table-cell">{item.clientName}</td>
                    <td className="table-cell">{item.droneSerialNo || '-'}</td>
                    <td className="table-cell">{item.items.length} parts</td>
                    <td className="table-cell">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink size={16} />}
                        className="text-primary-600"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-8 text-neutral-500">
                    No data available for the selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (reportType === 'monthly-inventory-in') {
      const filteredItems = incomingArticles.filter(item => {
        const itemDate = new Date(item.dateCreated);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
      
      // Group by vendor
      const vendorGroups = filteredItems.reduce((groups, item) => {
        const vendorId = item.vendorId;
        if (!groups[vendorId]) {
          groups[vendorId] = [];
        }
        groups[vendorId].push(item);
        return groups;
      }, {} as Record<string, typeof filteredItems>);
      
      return (
        <div className="space-y-8">
          {Object.keys(vendorGroups).length > 0 ? (
            Object.entries(vendorGroups).map(([vendorId, items]) => {
              const vendor = vendors.find(v => v.id === vendorId);
              const totalValue = items.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity, 
                0
              );
              
              return (
                <div key={vendorId} className="rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-medium">{vendor?.name || 'Unknown Vendor'}</h3>
                      <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                        <span className="text-sm">
                          <span className="font-medium">Total Items:</span> {items.length}
                        </span>
                        <span className="text-sm">
                          <span className="font-medium">Total Value:</span> {formatCurrency(totalValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="table-container rounded-none border-0">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-header-cell">Date</th>
                          <th className="table-header-cell">Part Number</th>
                          <th className="table-header-cell">Quantity</th>
                          <th className="table-header-cell">Unit Price</th>
                          <th className="table-header-cell">Status</th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {items.map(item => (
                          <tr key={item.id} className="table-row">
                            <td className="table-cell">{formatDate(item.dateCreated, 'dd MMM yyyy')}</td>
                            <td className="table-cell">{item.partNumber}</td>
                            <td className="table-cell">{item.quantity}</td>
                            <td className="table-cell">{formatCurrency(item.unitPrice)}</td>
                            <td className="table-cell capitalize">{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-neutral-200 p-8 text-center text-neutral-500">
              No data available for the selected date range
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Layout>
      <PageHeader
        title="Reports"
        description="Generate and view inventory reports"
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(value) => setReportType(value as ReportType)}
              fullWidth
              options={[
                { 
                  value: 'weekly-inventory-out', 
                  label: 'Weekly: Inventory Out' 
                },
                { 
                  value: 'monthly-inventory-in', 
                  label: 'Monthly: Inventory In' 
                },
              ]}
            />
            
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              leftIcon={<Calendar size={16} />}
            />
            
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              leftIcon={<Calendar size={16} />}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              {reportType === 'weekly-inventory-out'
                ? 'Weekly Inventory Out Report'
                : 'Monthly Inventory In Report'}
            </CardTitle>
            <div className="mt-4 flex space-x-2 sm:mt-0">
              <Button
                variant="outline"
                leftIcon={<FileText size={16} />}
              >
                Print
              </Button>
              <Button
                variant="primary"
                leftIcon={<Download size={16} />}
              >
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {generateReportData()}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ReportsPage;