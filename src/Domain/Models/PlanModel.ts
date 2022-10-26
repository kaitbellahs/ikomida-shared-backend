import { Types, Classes } from '@ikomida/shared-types'
import { Table, Column, DataType, HasMany } from 'sequelize-typescript'
import { Enum } from '../../Decorators/Enum.js'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'

@Table({
  paranoid: true,
  modelName: 'plan'
})
export default class PlanModel extends BaseModel {
  @Column(DataType.STRING(50))
  name?: string
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys())
  })
  discountType?: Types.TDiscount
  @Column(DataType.INTEGER)
  order?: number
  @Column(DataType.INTEGER)
  price?: number
  @Column(DataType.INTEGER)
  discount?: number
  @Column(DataType.INTEGER)
  staff?: number
  @Column(DataType.INTEGER)
  pushNotifications?: number
  @Column(DataType.INTEGER)
  categories?: number
  @Column(DataType.INTEGER)
  products?: number
  @Column(DataType.INTEGER)
  coupons?: number
  @Column(DataType.INTEGER)
  orders?: number
  @Column(DataType.INTEGER)
  productOptions?: number
  @Column(DataType.INTEGER)
  billing?: number
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  dueDateAfterXDays?: number
  @Column(DataType.JSON)
  @Enum(Types.TSupport)
  support?: Types.TSupport[]
  @Column(DataType.JSON)
  details?: Classes.CKeyValue[]
  @Column(DataType.BOOLEAN)
  highlighted?: boolean
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @HasMany(() => ContractModel)
  contracts?: ContractModel[]
}
