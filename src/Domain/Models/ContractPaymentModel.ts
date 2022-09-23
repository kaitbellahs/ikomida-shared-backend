import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import ContractPaymentSignatureModel from './ContractPaymentSignatureModel';

@Table({
  paranoid: true,
  modelName: 'contractPayment',
})
export default class ContractPaymentModel extends BaseModel {
  @Column(DataType.STRING(50))
  gateway?: string;
  @Column(DataType.TEXT)
  subscriptionID?: string;
  @Column(DataType.TEXT)
  paymentID?: string;
  @Column({
    type: DataType.ENUM(...Types.TAsaasPaymentStatus.keys()),
  })
  status?: Types.TAsaasPaymentStatus;
  @Column(DataType.STRING(50))
  plan?: string;
  @Column(DataType.STRING(50))
  billingType?: string;
  @Column(DataType.STRING(20))
  creditCardBrand?: string;
  @Column(DataType.TEXT)
  creditCardToken?: string;
  @Column(DataType.STRING(255))
  invoiceUrl?: string;
  @Column(DataType.STRING(50))
  invoiceNumber?: string;
  @Column(DataType.STRING(255))
  transactionReceiptUrl?: string;
  @Column(DataType.INTEGER({ length: 2 }))
  month?: number;
  @Column(DataType.INTEGER({ length: 6 }))
  creditCardNumber?: number;
  @Column(DataType.INTEGER)
  value?: number;
  @Column(DataType.INTEGER)
  netValue?: number;
  @Column(DataType.DATE)
  dueDate?: Date;
  @Column(DataType.DATE)
  confirmedDate?: Date;
  @Column(DataType.DATE)
  clientPaymentDate?: Date;
  @Column(DataType.DATE)
  nextDueDate?: Date;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @ForeignKey(() => ContractPaymentSignatureModel)
  @Column(DataType.UUID)
  contractPaymentSignatureId?: string;
  @BelongsTo(() => ContractPaymentSignatureModel)
  contractPaymentSignature?: ContractPaymentSignatureModel;
}
