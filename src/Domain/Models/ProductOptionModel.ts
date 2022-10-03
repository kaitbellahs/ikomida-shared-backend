import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import OrderModel from './OrderModel';
import OrderProductModel from './OrderProductModel';
import OrderProductOptionModel from './OrderProductOptionModel';
import OrderProductProductOptionModel from './OrderProductProductOptionModel';
import ProductCategoryModel from './ProductCategoryModel';
import ProductModel from './ProductModel';
import ProductOptionCategoryModel from './ProductOptionCategoryModel';

@Table({
  paranoid: true,
  modelName: 'productOption',
})
export default class ProductOptionModel extends BaseModel {
  @Column(DataType.CHAR(100))
  name?: string;
  @Column(DataType.STRING(255))
  image?: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  highlighted?: boolean;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  @Column(DataType.TEXT)
  order?: number;
  @Column(DataType.INTEGER)
  price?: number;
  @Column(DataType.INTEGER)
  units?: number;

  //MARK: --Associaions

  @ForeignKey(() => ProductOptionCategoryModel)
  @Column(DataType.UUID)
  productOptionCategoryId?: string;
  @BelongsTo(() => ProductOptionCategoryModel)
  productOptionCategory?: ProductOptionCategoryModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string;
  @BelongsTo(() => ProductModel)
  product?: ProductModel;

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
  @BelongsToMany(() => OrderModel, () => OrderProductOptionModel)
  orders?: OrderModel[];
  @BelongsToMany(() => OrderProductModel, () => OrderProductProductOptionModel)
  orderProducts?: OrderProductModel[];
}
