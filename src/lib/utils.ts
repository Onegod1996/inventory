import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parse } from 'date-fns';

// Merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

// Calculate unit price without GST
export function calculateUnitPriceWithoutGst(
  unitPrice: number,
  customDuty: number,
  sws: number,
  gst: number,
  carrierCharges: number
): number {
  // Unit price before GST calculation
  return unitPrice + customDuty + sws + carrierCharges;
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Convert string to title case
export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Format part number with proper padding
export function formatPartNumber(num: string | number): string {
  if (typeof num === 'string' && num.includes('-')) return num;
  const numStr = num.toString();
  return `VD-${numStr.padStart(6, '0')}`;
}

// Calculate available SKUs based on BOM and inventory
export function calculateAvailableSKUs(parts: Part[], bomList: {partId: string, quantity: number}[]): number {
  // Create a lookup map for faster access
  const inventory = new Map(parts.map(part => [part.id, part.currentStock]));
  
  // Calculate how many complete SKUs can be made
  const maxSkus = bomList.reduce((max, item) => {
    const stockAvailable = inventory.get(item.partId) || 0;
    const possibleSkus = Math.floor(stockAvailable / item.quantity);
    // The max number of SKUs is limited by the part with lowest availability
    return max === null ? possibleSkus : Math.min(max, possibleSkus);
  }, null as number | null);
  
  return maxSkus || 0;
}

// Parse date string to Date object
export function parseDate(dateString: string, formatString: string = 'yyyy-MM-dd'): Date {
  return parse(dateString, formatString, new Date());
}