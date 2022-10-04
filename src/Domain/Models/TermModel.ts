import { Types } from '@ikomida/shared-types'
import { Table, Column, DataType, HasMany } from 'sequelize-typescript'
import BaseModel from './BaseModel'
import TermHashModel from './TermHashModel'

@Table({
  paranoid: true,
  modelName: 'term'
})
export default class TermModel extends BaseModel {
  @Column(DataType.STRING(100))
  name?: string
  @Column(DataType.TEXT)
  text?: string
  @Column({
    type: DataType.ENUM(...Types.TTerm.keys())
  })
  type?: Types.TTerm
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  active?: boolean

  //MARK: --Associations
  @HasMany(() => TermHashModel)
  termHashs?: TermHashModel[]
}
