import { Vendor, Part, IncomingArticle, InventoryOut } from '../types';
import { generateId } from '../lib/utils';

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Tech Propellers Ltd.',
    contactPerson: 'Rahul Sharma',
    email: 'rahul@techpropellers.com',
    phone: '+91-9876543210',
    address: '123 Industrial Area, Bengaluru',
  },
  {
    id: 'v2',
    name: 'Drone Motors India',
    contactPerson: 'Priya Patel',
    email: 'priya@dronemotors.in',
    phone: '+91-9876543211',
    address: '456 Tech Park, Chennai',
  },
  {
    id: 'v3',
    name: 'Electronics Hub',
    contactPerson: 'Amit Kumar',
    email: 'amit@electronichub.in',
    phone: '+91-9876543212',
    address: '789 Electronics Zone, Delhi',
  },
];

// Mock Parts
export const mockParts: Part[] = [
  {
    id: 'p1',
    partNumber: '722201016',
    name: 'Battery 2200 mAh',
    description: 'Batteries for basic vikas kit',
    category: 'production',
    currentStock: 120,
    minStock: 50,
    vendorId: 'v1',
    unitPrice: 1300,
  },
  {
    id: 'p2',
    partNumber: '722201006',
    name: 'CW_Motor',
    description: '2212 920KV brushless motor',
    category: 'production',
    currentStock: 85,
    minStock: 40,
    vendorId: 'v2',
    unitPrice: 1200,
  },
  {
    id: 'p3',
    partNumber: 'VD-000003',
    name: 'Flight Controller F7',
    description: 'F7 flight controller with gyro',
    category: 'production',
    currentStock: 65,
    minStock: 25,
    vendorId: 'v3',
    unitPrice: 3500,
  },
  {
    id: 'p4',
    partNumber: 'VD-000004',
    name: 'LiPo Battery 4S 5000mAh',
    description: '4S 5000mAh 50C LiPo battery',
    category: 'production',
    currentStock: 55,
    minStock: 20,
    vendorId: 'v3',
    unitPrice: 4800,
  },
  {
    id: 'p5',
    partNumber: 'VD-000005',
    name: 'Camera Module HD',
    description: 'HD camera module with gimbal',
    category: 'production',
    currentStock: 30,
    minStock: 15,
    vendorId: 'v3',
    unitPrice: 5500,
  },
  {
    id: 'p6',
    partNumber: 'VD-000006',
    name: 'GPS Module',
    description: 'GPS module with compass',
    category: 'spare',
    currentStock: 45,
    minStock: 20,
    vendorId: 'v3',
    unitPrice: 2200,
  },
];

// Mock Incoming Articles
export const mockIncomingArticles: IncomingArticle[] = [
  {
    id: 'i1',
    partNumber: 'VD-000001',
    vendorId: 'v1',
    quantity: 50,
    unitPrice: 800,
    customDuty: 120,
    sws: 20,
    gst: 168,
    carrierCharges: 50,
    unitPriceWithoutGst: 990, // 800 + 120 + 20 + 50
    dateCreated: '2025-07-01T10:30:00Z',
    status: 'approved',
    finalAcceptedQuantity: 50,
    qcRemarks: 'All propellers in good condition',
  },
  {
    id: 'i2',
    partNumber: 'VD-000002',
    vendorId: 'v2',
    quantity: 30,
    unitPrice: 1150,
    customDuty: 230,
    sws: 35,
    gst: 254.7,
    carrierCharges: 85,
    unitPriceWithoutGst: 1500, // 1150 + 230 + 35 + 85
    dateCreated: '2025-07-05T14:45:00Z',
    status: 'qcComplete',
    finalAcceptedQuantity: 28,
    qcRemarks: 'Two motors have wiring issues',
    qcChecklistUrl: 'https://example.com/checklist/motor-i2',
  },
  {
    id: 'i3',
    partNumber: 'VD-000003',
    vendorId: 'v3',
    quantity: 25,
    unitPrice: 3400,
    customDuty: 510,
    sws: 75,
    gst: 714.5,
    carrierCharges: 120,
    unitPriceWithoutGst: 4105, // 3400 + 510 + 75 + 120
    dateCreated: '2025-07-10T09:15:00Z',
    status: 'counted',
    finalAcceptedQuantity: 25,
  },
  {
    id: 'i4',
    partNumber: 'VD-000004',
    vendorId: 'v3',
    quantity: 20,
    unitPrice: 4700,
    customDuty: 705,
    sws: 94,
    gst: 988.78,
    carrierCharges: 150,
    unitPriceWithoutGst: 5649, // 4700 + 705 + 94 + 150
    dateCreated: '2025-07-15T16:20:00Z',
    status: 'pending',
  },
];

// Mock Inventory Out
export const mockInventoryOut: InventoryOut[] = [
  {
    id: 'o1',
    orderNo: 'ORD-2025-001',
    clientName: 'AgriTech Solutions',
    droneSerialNo: 'VD-DRONE-001',
    batterySerialNo: 'VD-BAT-001',
    dateOut: '2025-06-15T10:00:00Z',
    items: [
      { partId: 'p1', partNumber: 'VD-000001', quantity: 4 },
      { partId: 'p2', partNumber: 'VD-000002', quantity: 4 },
      { partId: 'p3', partNumber: 'VD-000003', quantity: 1 },
      { partId: 'p4', partNumber: 'VD-000004', quantity: 1 },
    ],
  },
  {
    id: 'o2',
    orderNo: 'ORD-2025-002',
    clientName: 'City Surveillance',
    droneSerialNo: 'VD-DRONE-002',
    batterySerialNo: 'VD-BAT-002',
    dateOut: '2025-06-20T14:30:00Z',
    items: [
      { partId: 'p1', partNumber: 'VD-000001', quantity: 4 },
      { partId: 'p2', partNumber: 'VD-000002', quantity: 4 },
      { partId: 'p3', partNumber: 'VD-000003', quantity: 1 },
      { partId: 'p4', partNumber: 'VD-000004', quantity: 1 },
      { partId: 'p5', partNumber: 'VD-000005', quantity: 1 },
    ],
  },
  {
    id: 'o3',
    orderNo: 'ORD-2025-003',
    clientName: 'AgriTech Solutions',
    dateOut: '2025-06-25T11:45:00Z',
    items: [
      { partId: 'p6', partNumber: 'VD-000006', quantity: 2 },
    ],
  },
];

// Mock Production BOM
export const mockProductionBOM = [
  { partId: 'p1', partNumber: 'VD-000001', name: 'Propeller Set 10x4.5', quantity: 4 },
  { partId: 'p2', partNumber: 'VD-000002', name: 'Brushless Motor 2212', quantity: 4 },
  { partId: 'p3', partNumber: 'VD-000003', name: 'Flight Controller F7', quantity: 1 },
  { partId: 'p4', partNumber: 'VD-000004', name: 'LiPo Battery 4S 5000mAh', quantity: 1 },
];

// Mock Spare BOM
export const mockSpareBOM = [
  { partId: 'p1', partNumber: 'VD-000001', name: 'Propeller Set 10x4.5', quantity: 2 },
  { partId: 'p2', partNumber: 'VD-000002', name: 'Brushless Motor 2212', quantity: 1 },
  { partId: 'p6', partNumber: 'VD-000006', name: 'GPS Module', quantity: 1 },
];

// Mock Add-on BOM
export const mockAddonBOM = [
  { partId: 'p5', partNumber: 'VD-000005', name: 'Camera Module HD', quantity: 1 },
];