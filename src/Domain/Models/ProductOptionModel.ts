import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import ProductCategoryModel from './ProductCategoryModel';
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
    defaultValue: false
  })
  highlighted?: boolean;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
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

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @ForeignKey(() => ProductCategoryModel)
  @Column(DataType.UUID)
  productCategoryId?: string;
  @BelongsTo(() => ProductCategoryModel)
  productCategory?: ProductCategoryModel;
}
