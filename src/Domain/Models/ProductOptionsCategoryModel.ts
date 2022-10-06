import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import ProductCategoryModel from './ProductCategoryModel.js'
import ProductModel from './ProductModel.js'
import ProductOptionModel from './ProductOptionModel.js'

@Table({
  paranoid: true,
  modelName: 'productOptionsCategory'
})
export default class ProductOptionsCategoryModel extends BaseModel {
  @Column(DataType.CHAR(100))
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
  min?: number
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  max?: number
  @Column(DataType.INTEGER)
  order?: number

  //MARK: --Associations

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

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[]
}
