import { Table, Column, DataType, HasMany, HasOne } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import UserModel from './UserModel'
import ContractModel from './ContractModel'
import ReferralRevuneModel from './ReferralRevuneModel'

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
