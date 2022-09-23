import { Table, Column, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import ProductModel from './ProductModel';

@Table({
  paranoid: true,
  modelName: 'productCategory',
})
export default class ProductCategoryModel extends BaseModel {
  @Column(DataType.STRING(100))
  title?: string;
  @Column(DataType.TEXT)
  description?: string;
  @Column(DataType.INTEGER)
  order?: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;

  //MARK: --Associations
  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;

  @HasMany(() => ProductModel)
  products?: ProductModel[];
}
