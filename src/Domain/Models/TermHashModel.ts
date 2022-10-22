import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import BaseModel from './BaseModel.js'
import TermModel from './TermModel.js'
import UserModel from './UserModel.js'
import ContractModel from './ContractModel.js'

@Table({
  paranoid: true,
  modelName: 'termHash'
})
export default class TermHashModel extends BaseModel {
  @Column(DataType.TEXT)
  hash?: string
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @ForeignKey(() => TermModel)
  @Column(DataType.UUID)
  termId?: string
  @BelongsTo(() => TermModel)
  term?: TermModel

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string
  @BelongsTo(() => UserModel)
  user?: UserModel

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string
  @BelongsTo(() => ContractModel)
  contract?: ContractModel
}
