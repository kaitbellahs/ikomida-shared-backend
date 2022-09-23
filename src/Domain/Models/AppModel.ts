import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import UserModel from './UserModel';
import ContractModel from './ContractModel';
import BaseModel from './BaseModel';

@Table({
  paranoid: true,
  modelName: 'app',
})
export default class AppModel extends BaseModel {
  @Column(DataType.STRING(255))
  bundleId?: string;
  @Column(DataType.STRING(100))
  displayName?: string;
  @Column(DataType.STRING(10))
  platform?: string;
  @Column(DataType.STRING(50))
  appVersion?: string;
  @Column(DataType.STRING(255))
  fireBaseId?: string;
  @Column(DataType.STRING(20))
  iOSProfileId?: string;
  @Column(DataType.STRING(50))
  storeStatus?: string;
  @Column(DataType.TEXT)
  storeNote?: string;
  @Column(DataType.JSON)
  storeEvidences: any;
  @Column(DataType.STRING(50))
  storeVersion?: string;
  @Column(DataType.STRING(50))
  storeBuildStatus?: string;
  @Column(DataType.STRING(50))
  storePublishStatus?: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;

  //MARK: --Associations
  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  userId?: string;
  @BelongsTo(() => UserModel)
  user?: UserModel;

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;
  @BelongsTo(() => ContractModel)
  contract?: ContractModel;
}
