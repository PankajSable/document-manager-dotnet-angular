export interface Document {
  id: number; documentId: string; clientId: number; clientName: string; phone?: string;
  documentType?: string; propertyAddress?: string; expiryDate?: string; notes?: string;
  fileName: string; contentType: string; fileSize: number; createdBy: string; createdAt: string; updatedAt?: string;
}
export interface DocumentSearch { name: string; documentId: string; type: string; from: string; to: string; }

export interface Client { id?: number; name: string; phone?: string; email?: string; address?: string; docCount?: number; }
export interface ClientDetail extends Client { documents: Document[]; }

export interface AppUser { id: number; username: string; role: string; isActive: boolean; }
export interface CreateUser { username: string; password: string; role: string; }
export interface UpdateUser { role: string; isActive: boolean; password?: string; }

export interface LoginResponse { token: string; username: string; role: string; }
export interface Dashboard { totalDocuments: number; totalClients: number; expired: number; expiringIn30: number; due: Document[]; }

export const DOCUMENT_TYPES = ['Sale deed', 'Rent agreement', '7/12 extract', 'Property card', 'NOC',
  'Tax receipt', 'ID proof', 'Power of attorney', 'Brokerage agreement', 'Other'];
