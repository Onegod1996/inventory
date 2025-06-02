// Vendor types
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

// Part types
export interface Part {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: 'production' | 'spare' | 'addon';
  currentStock: number;
  minStock: number;
  vendorId: string;
  unitPrice: number;
}

// Incoming article types
export interface IncomingArticle {
  id: string;
  partNumber: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  customDuty: number;
  sws: number;
  gst: number;
  carrierCharges: number;
  unitPriceWithoutGst: number;
  dateCreated: string;
  status: 'pending' | 'counted' | 'qcComplete' | 'approved';
  finalAcceptedQuantity?: number;
  qcRemarks?: string;
  qcChecklistUrl?: string;
}

// Inventory out types
export interface InventoryOut {
  id: string;
  orderNo: string;
  clientName: string;
  droneSerialNo?: string;
  batterySerialNo?: string;
  dateOut: string;
  items: InventoryOutItem[];
}

export interface InventoryOutItem {
  partId: string;
  partNumber: string;
  quantity: number;
}

// Production completion types
export interface ProductionCompletion {
  id: string;
  unitsCompleted: number;
  date: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'inventory' | 'production' | 'qc' | 'viewer';
}

// Report types
export type ReportType = 'weekly-inventory-out' | 'monthly-inventory-in';

export interface Report {
  id: string;
  type: ReportType;
  startDate: string;
  endDate: string;
  generatedAt: string;
  generatedBy: string;
}