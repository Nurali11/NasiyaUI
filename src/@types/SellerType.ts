export interface SellerMeType {
    id: string,
    name: string,
    email: string,
    phone: string,
    image: string,
    password: string,
    balance: number,
    active: string,
    createdAt: string,
    updatedAt: string,
    Debtor: any[]
    DebtorImage: any[],
    Messages: any[],
    Nasiya: any[],
    Sample: any[]
}

// export interface SellerMeType {
//   data: {
//     id: string,
//     name: string,
//     email: string,
//     phone: string,
//     image: string,
//     password: string,
//     balance: number,
//     active: string,
//     createdAt: string,
//     updatedAt: string,
//     Debtor: [
//       {
//         id: string,
//         name: string,
//         address: string,
//         comment: string,
//         sellerId: string,
//         createdAt: string,
//         updatedAt: string
//       }
//     ],
//     DebtorImage: [
//       {
//         id: string,
//         image: string,
//         sellerId: string,
//         debtorId: string,
//         createdAt: string,
//         updatedAt: string
//       },
//       {
//         id: string,
//         image: string,
//         sellerId: string,
//         debtorId: string,
//         createdAt: string,
//         updatedAt: string
//       }
//     ],
//     Messages: [],
//     Nasiya: [
//       {
//         id: string,
//         name: string,
//         startDate: string,
//         period: 6,
//         comment: string,
//         debtorId: string,
//         sum: number,
//         monthlySum: number,
//         remainedSum: number,
//         sellerId: string,
//         createdAt: string,
//         updatedAt: string
//       }
//     ],
//     Sample: [
//       {
//         id: string,
//         comment: string,
//         isActive: string,
//         sellerId: string,
//         createdAt: string,
//         updatedAt: string
//       }
//     ]
//   }
// }