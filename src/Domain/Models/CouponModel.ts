import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import { Enum } from '../../Decorators/Enum.js'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import OrderModel from './OrderModel.js'

@Table({
  paranoid: true,
  modelName: 'coupon'
})
export default class CouponModel extends BaseModel {
  @Column(DataType.STRING(20))
  name?: string
  @Column(DataType.INTEGER)
  value?: number
  @Column(DataType.INTEGER)
  minValue?: number
  @Column(DataType.DATE)
  validity?: Date
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys())
  })
  valueType?: Types.TDiscount
  @Column(DataType.INTEGER)
  quantity?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean
  @Column({
    type: DataType.JSON
  })
  @Enum(Types.TOrderType)
  orderTypes?: Types.TOrderType[]

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: number
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @HasMany(() => OrderModel)
  orders?: OrderModel[]
}
