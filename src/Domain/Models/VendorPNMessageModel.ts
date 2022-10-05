import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import PNMessageModel from './PNMessageModel.js'

@Table({
  paranoid: true,
  modelName: 'vendorPNMessage'
})
export default class VendorPNMessageModel extends BaseModel {
  @Column(DataType.STRING(255))
  remoteId?: string
  @Column(DataType.STRING(100))
  title?: string
  @Column(DataType.STRING(255))
  body?: string
  @Column(DataType.JSON)
  data?: string
  @Column(DataType.INTEGER)
  sends?: number
  @Column(DataType.INTEGER)
  fails?: number
  @Column(DataType.INTEGER)
  opens?: number

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string

  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @HasMany(() => PNMessageModel)
  pNMessages?: PNMessageModel[]
}
