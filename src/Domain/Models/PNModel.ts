import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import UserModel from './UserModel.js'
import PNMessageModel from './PNMessageModel.js'
import Roles from '../../Types/Roles.js'

@Table({
  paranoid: true,
  modelName: 'pN'
})
export default class PNModel extends BaseModel {
  @Column(DataType.STRING(10))
  platform?: string
  @Column(DataType.STRING(255))
  token?: string
  @Column({
    type: DataType.ENUM(...Roles.keys())
  })
  role?: Roles
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

  @HasMany(() => PNMessageModel)
  pNMessages?: PNMessageModel[]
}
