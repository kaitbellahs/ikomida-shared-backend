import { Classes } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import ContractModel from './ContractModel'
import VendorPaymentGatewayModel from './VendorPaymentGatewayModel'

@Table({
  paranoid: true,
  modelName: 'vendorSettings'
})
export default class VendorSettingsModel extends BaseModel {
  @Column(DataType.TEXT)
  restaurantImage?: string
  @Column(DataType.STRING(100))
  contractName?: string
  @Column(DataType.STRING(25))
  contractIdentity?: string
  @Column(DataType.STRING(255))
  email?: string
  @Column(DataType.STRING(20))
  name?: string
  @Column(DataType.STRING(50))
  lastName?: string
  @Column(DataType.STRING(20))
  identity?: string
  @Column(DataType.INTEGER({ length: 3 }))
  areaCode?: number
  @Column(DataType.STRING(20))
  phone?: string
  @Column(DataType.JSON)
  businessHours?: Classes.CBusinessTimeHours[]
  @Column(DataType.JSON)
  businessDays?: number[]
  @Column(DataType.JSON)
  layout?: Classes.CLayout
  @Column(DataType.INTEGER)
  delivery?: number
  @Column(DataType.INTEGER)
  deliveryMin?: number
  @Column(DataType.INTEGER)
  preparationMin?: number
  @Column(DataType.INTEGER)
  preparationMax?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  deliveryFree?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @HasOne(() => VendorPaymentGatewayModel)
  vendorPaymentGateway?: VendorPaymentGatewayModel
}
