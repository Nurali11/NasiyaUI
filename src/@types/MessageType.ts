import type { SingleDebtorType } from "./SingleDebtorType"

export interface SingleMessageType {
      id: string,
      text: string,
      isSend: true,
      debtorId: string,
      sellerId: string,
      createdAt: string,
      updatedAt: string,
}

export interface MessagesType extends SingleDebtorType {
    Message: SingleMessageType[]
}