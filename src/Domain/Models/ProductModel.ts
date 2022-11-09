import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import ProductCategoryModel from './ProductCategoryModel.js'
import ProductOptionsCategoryModel from './ProductOptionsCategoryModel.js'
import ProductOptionModel from './ProductOptionModel.js'
import { Enum } from '../../Decorators/Enum.js'

@Table({
  paranoid: true,
  modelName: 'product'
})
export default class ProductModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string
  @Column(DataType.TEXT)
  description?: string
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys())
  })
  discountType?: Types.TDiscount
  @Column(DataType.STRING(255))
  image?: string
  @Column(DataType.INTEGER)
  order?: number
  @Column(DataType.INTEGER)
  serves?: number
  @Column(DataType.INTEGER)
  price?: number
  @Column(DataType.INTEGER)
  discount?: number
  @Column(DataType.INTEGER)
  measure?: number
  @Column({
    type: DataType.ENUM(...Types.TMeasure.keys()),
    defaultValue: Types.TMeasure.GRAM.id
  })
  measureUnit?: Types.TMeasure
  @Column(DataType.INTEGER)
  quantity?: number
  @Column(DataType.INTEGER)
  totalQuantity?: number
  @Column(DataType.INTEGER)
  maxQuantityPerOrder?: number
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

  //MARK: --Associaions

  @ForeignKey(() => ProductCategoryModel)
  @Column(DataType.UUID)
  productCategoryId?: string
  @BelongsTo(() => ProductCategoryModel)
  productCategory?: ProductCategoryModel

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @HasMany(() => ProductOptionsCategoryModel)
  productOptionsCategories?: ProductOptionsCategoryModel[]

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[]
}
