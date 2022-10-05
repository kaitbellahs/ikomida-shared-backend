import { Table, Column, DataType, HasMany, HasOne } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'
import ReferralRevuneModel from './ReferralRevuneModel.js'

@Table({
  paranoid: true,
  modelName: 'referral'
})
export default class ReferralModel extends BaseModel {
  @Column(DataType.STRING(8))
  code?: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @HasMany(() => ReferralRevuneModel)
  referralRevunes?: ReferralRevuneModel[]

  @HasMany(() => UserModel)
  users?: UserModel[]

  @HasMany(() => ContractModel)
  contracts?: ContractModel[]

  @HasOne(() => UserModel)
  user?: UserModel

  @HasOne(() => ContractModel)
  contract?: ContractModel
}
