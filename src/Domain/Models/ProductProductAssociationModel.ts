import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import ProductModel from './ProductModel.js'

@Table({
  paranoid: true,
  modelName: 'pPAssociation'
})
export default class ProductProductAssociationModel extends BaseModel {
  //MARK: --Associations
  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  parentId?: string

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  childId?: string
}
