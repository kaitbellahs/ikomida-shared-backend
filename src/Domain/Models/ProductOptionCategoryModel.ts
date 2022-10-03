import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import ProductModel from './ProductModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'productOptionsCategory',
})
export default class ProductOptionCategoryModel extends BaseModel {
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
  min?: number;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  max?: number;
  @Column(DataType.INTEGER)
  order?: number;

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  productId?: string;
  @BelongsTo(() => ProductModel)
  product?: ProductModel;

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[];
}
