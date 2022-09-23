import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Roles from '../../Types/Roles';
import BaseModel from './BaseModel';
import ContractModel from './ContractModel';
import UserModel from './UserModel';

@Table({
  paranoid: true,
  modelName: 'phoneValidationCode',
})
export default class PhoneValidationCodeModel extends BaseModel {
  @Column({
    type: DataType.ENUM(...Roles.keys()),
  })
  role?: Roles;
  @Column(DataType.INTEGER({ length: 4 }))
  code?: number;
  @Column(DataType.TEXT)
  signature?: string;
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
