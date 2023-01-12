import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo, BelongsToMany } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'
import OrderModel from './OrderModel.js'
import PosModel from './PosModel.js'
import OrdersGroupUserAssociationModel from './OrdersGroupUserAssociationModel.js'
import { Types } from '@ikomida/shared-types'

@Table({
  paranoid: true,
  modelName: 'ordersGroup'
})
export default class OrdersGroupModel extends BaseModel {
  @Column(DataType.STRING(16))
  code?: string
  @Column({
    type: DataType.ENUM(...Types.TOrdersGroup.keys())
  })
  kind?: Types.TOrdersGroup

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

  @ForeignKey(() => PosModel)
  @Column(DataType.UUID)
  posId?: string
  @BelongsTo(() => PosModel)
  pos?: PosModel

  @HasMany(() => OrderModel)
  orders?: OrderModel[]

  @BelongsToMany(() => UserModel, () => OrdersGroupUserAssociationModel)
  users?: UserModel[]
}
