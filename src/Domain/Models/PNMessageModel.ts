import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import PNModel from './PNModel.js'
import UserModel from './UserModel.js'
import VendorPNMessageModel from './VendorPNMessageModel.js'

@Table({
  paranoid: true,
  modelName: 'pNMessage'
})
export default class PNMessageModel extends BaseModel {
  @Column(DataType.STRING(255))
  remoteId?: string
  @Column(DataType.STRING(100))
  title?: string
  @Column(DataType.STRING(255))
  body?: string
  @Column(DataType.JSON)
  data?: any
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  send?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  opened?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  vendor?: boolean

  //MARK: --Associations
  @ForeignKey(() => VendorPNMessageModel)
  @Column(DataType.UUID)
  vendorPNMessageId?: string
  @BelongsTo(() => VendorPNMessageModel)
  vendorPNMessage?: VendorPNMessageModel

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string
  @BelongsTo(() => UserModel)
  user?: UserModel

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @ForeignKey(() => PNModel)
  @Column(DataType.UUID)
  pNId?: string
  @BelongsTo(() => PNModel)
  pN?: PNModel
}
