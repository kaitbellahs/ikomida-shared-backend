import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import ContractPaymentModel from './ContractPaymentModel';
import ContractModel from './ContractModel';
import BaseModel from './BaseModel';
import { Types } from '@ikomida/shared-types';

@Table({
  paranoid: true,
  modelName: 'contractPaymentSignature',
})
export default class ContractPaymentSignatureModel extends BaseModel {
  @Column(DataType.STRING(50))
  gateway?: string;
  @Column(DataType.TEXT)
  subscriptionID?: string;
  @Column({
    type: DataType.ENUM(...Types.TAsaasSignatureStatus.keys()),
  })
  status?: Types.TAsaasSignatureStatus;
  @Column(DataType.STRING(20))
  cycle?: string;
  @Column(DataType.TEXT)
  cardToken?: string;
  @Column(DataType.INTEGER)
  value?: number;
  @Column(DataType.INTEGER)
  netValue?: number;
  @Column(DataType.INTEGER({ length: 6 }))
  number?: number;
  @Column(DataType.DATE)
  nextDueDate?: Date;
  @Column(DataType.DATE)
  lastDueDate?: Date;
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

  @HasMany(() => ContractPaymentModel)
  contractPayments?: ContractPaymentModel[];
}
