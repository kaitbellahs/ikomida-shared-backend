import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'
import BaseModel from './BaseModel.js'
import { Types } from '@ikomida/shared-types'

@Table({
  paranoid: true,
  modelName: 'app'
})
export default class AppModel extends BaseModel {
  @Column(DataType.STRING(255))
  bundleId?: string
  @Column(DataType.STRING(100))
  displayName?: string
  @Column(DataType.STRING(10))
  platform?: string
  @Column(DataType.STRING(50))
  appVersion?: string
  @Column(DataType.STRING(255))
  fireBaseId?: string
  @Column(DataType.STRING(20))
  iOSProfileId?: string
  @Column({
    type: DataType.ENUM(...Types.TAppStoreStatus.keys())
  })
  storeStatus?: Types.TAppStoreStatus
  @Column(DataType.TEXT)
  storeNote?: string
  @Column(DataType.JSON)
  storeEvidences: any
  @Column(DataType.STRING(50))
  storeVersion?: string
  @Column({
    type: DataType.ENUM(...Types.TAppStoreStatus.keys())
  })
  storeBuildStatus?: Types.TAppStoreStatus
  @Column({
    type: DataType.ENUM(...Types.TAppStoreStatus.keys())
  })
  storePublishStatus?: Types.TAppStoreStatus
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean
  @Column(DataType.STRING(255))
  icon?: string
  @Column(DataType.STRING(3500))
  description?: string
  @Column(DataType.STRING(255))
  androidLink?: string
  @Column(DataType.STRING(255))
  iosLink?: string

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
