import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import UserModel from './UserModel'
import ReferralRevuneModel from './ReferralRevuneModel'
import { Types } from '@ikomida/shared-types'

@Table({
  paranoid: true,
  modelName: 'userPIXKey'
})
export default class UserPIXKeyModel extends BaseModel {
  @Column(DataType.STRING(30))
  name?: string
  @Column({
    type: DataType.ENUM(...Types.TPIX.keys())
  })
  type?: Types.TPIX
  @Column(DataType.STRING(255))
  key?: string
  @Column(DataType.STRING(50))
  bank?: string
  @Column(DataType.INTEGER)
  agency?: number
  @Column(DataType.INTEGER)
  account?: number
  @Column(DataType.STRING(255))
  note?: string
  @Column(DataType.STRING(50))
  status?: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @ForeignKey(() => ReferralRevuneModel)
  @Column(DataType.UUID)
  referralRevuneId?: string
  @BelongsTo(() => ReferralRevuneModel)
  referralRevune?: ReferralRevuneModel

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string
  @BelongsTo(() => UserModel)
  user?: UserModel
}
