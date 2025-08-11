export interface ImageType {
  id: string;
  image: string;
  sellerId: string;
  debtorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneType {
  id: string;
  phone: string;
  debtorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NasiyaType {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  period: number;
  comment: string;
  debtorId: string;
  sum: number;
  monthlySum: number;
  remainedSum: number;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  PaidMonths: PaidMonths[]
}

export interface PaidMonths {
    id: string,
    period: number,
    sum: number,
    endDate: string,
    nasiyaId: string,
    createdAt: string,
    updatedAt: string
}

export interface PaymentHistoryType {
  id: string;
  amount: number;
  debtorId: string;
  createAt: string;
  nasiyaId: string;
}

export interface SellerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  password: string;
  balance: number;
  active: string;
  createdAt: string;
  updatedAt: string;
}

export interface SingleDebtorType {
  id: string;
  name: string;
  address: string;
  star: boolean;
  comment: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  total: number;
  Images: ImageType[];
  Phone: PhoneType[];
  Message: any[];
  Nasiya: NasiyaType[];
  PaymentHistory: PaymentHistoryType[];
  Payment: any[];
  Seller: SellerType;
}

export interface DebtType {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    period: number;
    comment: string;
    debtorId: string;
    sum: number;
    monthlySum: number;
    remainedSum: number;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
    Debtor: SellerType[]
    nasiyaImages: ImageType[]
    NotPaidMonths: PaidMonths[]
    PaymentHistory: PaymentHistoryType[]
}