import { Table, Column, DataType, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ReferralModel from './ReferralModel.js'
import UserPIXKeyModel from './UserPIXKeyModel.js'

@Table({
  paranoid: true,
  modelName: 'referralRevune'
})
export default class ReferralRevuneModel extends BaseModel {
  @Column(DataType.INTEGER)
  total?: number
  @Column(DataType.INTEGER)
  revune?: number
  @Column(DataType.INTEGER)
  bonus?: number
  @Column(DataType.DATE)
  date?: Date
  @Column(DataType.JSON)
  revuneDetails?: any
  @Column(DataType.JSON)
  bonusDetails?: any
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  approved?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  paid?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @ForeignKey(() => ReferralModel)
  @Column(DataType.UUID)
  referralId?: string
  @BelongsTo(() => ReferralModel)
  referral?: ReferralModel

  @HasOne(() => UserPIXKeyModel)
  UserBankAccount?: UserPIXKeyModel
}
