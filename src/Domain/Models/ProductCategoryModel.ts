import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ContractModel from './ContractModel.js'
import ProductModel from './ProductModel.js'
import ProductOptionsCategoryModel from './ProductOptionsCategoryModel.js'
import ProductOptionModel from './ProductOptionModel.js'
import { Classes } from '@ikomida/shared-types'

@Table({
  paranoid: true,
  modelName: 'productCategory'
})
export default class ProductCategoryModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string
  @Column(DataType.TEXT)
  description?: string
  @Column(DataType.INTEGER)
  order?: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean
  @Column(DataType.JSON)
  businessHours?: Classes.CBusinessTime[]

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel

  @HasMany(() => ProductModel)
  products?: ProductModel[]

  @HasMany(() => ProductOptionsCategoryModel)
  productOptionsCategories?: ProductOptionsCategoryModel[]

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[]
}
