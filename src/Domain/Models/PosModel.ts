import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'
import OrderModel from './OrderModel.js'
import OrdersGroupModel from './OrdersGroupModel.js'

@Table({
  paranoid: true,
  modelName: 'pos'
})
export default class PosModel extends BaseModel {
  @Column(DataType.DATE)
  closeDate?: Date
  @Column(DataType.INTEGER)
  openBalance?: Number
  @Column(DataType.INTEGER)
  closeBalance?: Number
  @Column(DataType.INTEGER)
  discount?: Number
  @Column(DataType.STRING(255))
  discountRaison?: string
  @Column(DataType.STRING(50))
  sessionId?: string
  @Column(DataType.DATE)
  sessionUpdatedAt?: Date

  //MARK: --Associations
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

  @HasMany(() => OrderModel)
  orders?: OrderModel[]

  @HasMany(() => OrdersGroupModel)
  ordersGroups?: OrdersGroupModel[]
}
