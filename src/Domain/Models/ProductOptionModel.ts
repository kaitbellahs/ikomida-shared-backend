import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import OrderProductOptionModel from './OrderProductOptionModel.js'
import ProductCategoryModel from './ProductCategoryModel.js'
import ProductModel from './ProductModel.js'
import ProductOptionsCategoryModel from './ProductOptionsCategoryModel.js'

@Table({
  paranoid: true,
  modelName: 'productOption'
})
export default class ProductOptionModel extends BaseModel {
  @Column(DataType.STRING(100))
  name?: string
  @Column(DataType.STRING(255))
  image?: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  highlighted?: boolean
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  order?: number
  @Column(DataType.INTEGER)
  price?: number
  @Column(DataType.INTEGER)
  units?: number

  //MARK: --Associaions

  @ForeignKey(() => ProductOptionsCategoryModel)
  @Column(DataType.UUID)
  productOptionsCategoryId?: string
  @BelongsTo(() => ProductOptionsCategoryModel)
  productOptionsCategory?: ProductOptionsCategoryModel

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string
  @BelongsTo(() => ProductModel)
  product?: ProductModel

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

  @HasMany(() => OrderProductOptionModel)
  orderProductOptions?: OrderProductOptionModel[]
}
