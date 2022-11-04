import { Table, Column, DataType } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'

@Table({
  paranoid: true,
  modelName: 'contact'
})
export default class ContactModel extends BaseModel {
  @Column(DataType.STRING(50))
  name?: string
  @Column(DataType.STRING(100))
  lastName?: string
  @Column(DataType.STRING(3))
  areaCode?: string
  @Column(DataType.STRING(20))
  phone?: string
  @Column(DataType.STRING(255))
  email?: string
  @Column(DataType.STRING(150))
  contractName?: string
}
