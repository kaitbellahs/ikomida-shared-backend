import { Table, Column, DataType } from 'sequelize-typescript';
import Roles from '../../Types/Roles';
import BaseModel from './BaseModel';

@Table({
  paranoid: true,
  modelName: 'loginFail',
})
export default class LoginFailModel extends BaseModel {
  @Column(DataType.STRING(255))
  ikomidaID?: string;
  @Column(DataType.STRING(20))
  ip?: string;
  @Column({
    type: DataType.ENUM(...Roles.keys()),
  })
  role?: Roles;
  @Column(DataType.STRING(20))
  phone?: string;
  @Column(DataType.INTEGER({ length: 2 }))
  areaCode?: number;
  @Column(DataType.STRING(10))
  platform?: string;
  @Column(DataType.INTEGER)
  attempts?: number;
  @Column(DataType.INTEGER)
  blockWindow?: number;
  @Column(DataType.DATE)
  blockDate?: Date;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;
}
