import type { DebtType, SingleDebtorType } from "./SingleDebtorType"

export interface PaymentsHistoryType {
    id: string,
    amount: 300000,
    debtorId: string,
    createAt: string,
    nasiyaId: string | null,
    Debtor: SingleDebtorType
    Nasiya: DebtType | null
}