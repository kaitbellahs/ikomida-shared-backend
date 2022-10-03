import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import ProductCategoryModel from './ProductCategoryModel';
import ProductOptionCategoryModel from './ProductOptionCategoryModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'product',
})
export default class ProductModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string;
  @Column(DataType.TEXT)
  description?: string;
  @Column({
    type: DataType.ENUM(...Types.TDiscount.keys()),
  })
  discountType?: Types.TDiscount;
  @Column(DataType.STRING(255))
  image?: string;
  @Column(DataType.INTEGER)
  order?: number;
  @Column(DataType.INTEGER)
  serves?: number;
  @Column(DataType.INTEGER)
  price?: number;
  @Column(DataType.INTEGER)
  discount?: number;
  @Column(DataType.INTEGER)
  weight?: number;
  @Column(DataType.INTEGER)
  quantity?: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;

  //MARK: --Associaions

  @ForeignKey(() => ProductCategoryModel)
  @Column(DataType.UUID)
  productCategoryId?: string;
  @BelongsTo(() => ProductCategoryModel)
  productCategory?: ProductCategoryModel;

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @HasMany(() => ProductOptionCategoryModel)
  productOptionCategories?: ProductOptionCategoryModel[];

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[];
}
