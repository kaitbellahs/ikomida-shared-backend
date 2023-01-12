import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import UserModel from './UserModel.js'
import OrdersGroupModel from './OrdersGroupModel.js'

@Table({
  paranoid: true,
  modelName: 'oGUAssociation'
})
export default class OrdersGroupUserAssociationModel extends BaseModel {
  //MARK: --Associations
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string

  @ForeignKey(() => OrdersGroupModel)
  @Column(DataType.UUID)
  ordersGroupId?: string
}
