import { Types } from '@ikomida/shared-types';
import { Table, Column, DataType } from 'sequelize-typescript';
import BaseModel from './BaseModel';

@Table({
  paranoid: true,
  modelName: 'setting',
})
export default class SettingModel extends BaseModel {
  @Column(DataType.STRING(50))
  name?: string;
  @Column(DataType.TEXT)
  value?: string;
  @Column({
    type: DataType.ENUM(...Types.TSetting.keys()),
  })
  type?: Types.TSetting;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;
}
