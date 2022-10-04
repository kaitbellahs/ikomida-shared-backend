import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import UserModel from './UserModel'
import ContractModel from './ContractModel'
import OrderModel from './OrderModel'
import { Types } from '@ikomida/shared-types'
import Roles from '../../Types/Roles'

@Table({
  paranoid: true,
  modelName: 'address'
})
export default class AddressModel extends BaseModel {
  @Column({
    type: DataType.ENUM(...Roles.keys())
  })
  role?: Roles
  @Column({
    type: DataType.ENUM(...Types.TAddress.keys())
  })
  kind?: Types.TAddress
  @Column(DataType.STRING(20))
  postalCode?: string
  @Column(DataType.STRING(255))
  street?: string
  @Column(DataType.STRING(50))
  number?: string
  @Column(DataType.STRING(50))
  complement?: string
  @Column(DataType.STRING(50))
  neighborhood?: string
  @Column(DataType.STRING(50))
  city?: string
  @Column(DataType.STRING(2))
  stat?: string
  @Column(DataType.STRING(255))
  reference?: string
  @Column(DataType.INTEGER)
  distance?: number
  @Column(DataType.INTEGER)
  duration?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  selected?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

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
}
