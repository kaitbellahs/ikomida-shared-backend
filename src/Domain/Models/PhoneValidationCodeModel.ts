import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import UserModel from './UserModel.js'

@Table({
  paranoid: true,
  modelName: 'phoneValidationCode'
})
export default class PhoneValidationCodeModel extends BaseModel {
  @Column({
    type: DataType.ENUM(...Types.TRoles.keys())
  })
  role?: Types.TRoles
  @Column(DataType.INTEGER({ length: 4 }))
  code?: number
  @Column(DataType.TEXT)
  signature?: string
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
}
