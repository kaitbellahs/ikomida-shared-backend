import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import VendorSettingsModel from './VendorSettingsModel.js'

@Table({
  paranoid: true,
  modelName: 'vendorPaymentGateway'
})
export default class VendorPaymentGatewayModel extends BaseModel {
  @Column(DataType.STRING(50))
  gateway?: string
  @Column(DataType.JSON)
  data: any
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

  @ForeignKey(() => VendorSettingsModel)
  @Column(DataType.UUID)
  vendorSettingsId?: string
  @BelongsTo(() => VendorSettingsModel)
  vendorSettings?: VendorSettingsModel
}
