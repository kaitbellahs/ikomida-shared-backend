import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BaseModel from './BaseModel';
import UserModel from './UserModel';

@Table({
  paranoid: true,
  modelName: 'userInfo',
})
export default class UserInfoModel extends BaseModel {
  @Column(DataType.STRING(20))
  ip?: string;
  @Column(DataType.JSON)
  forwardedIp?: any;
  @Column(DataType.STRING(10))
  platform?: string;
  @Column(DataType.STRING(255))
  deviceId?: string;
  @Column(DataType.STRING(50))
  region?: string;
  @Column(DataType.STRING(50))
  subRegion?: string;
  @Column(DataType.STRING(50))
  citylatlong?: string;
  @Column(DataType.STRING(50))
  city?: string;
  @Column(DataType.STRING(50))
  app?: string;

  //MARK: --Associations
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string;

  @BelongsTo(() => UserModel)
  user?: UserModel;
}
