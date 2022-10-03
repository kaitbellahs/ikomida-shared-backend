import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import AddressModel from './AddressModel';
import BaseModel from './BaseModel';
import CouponModel from './CouponModel';
import UserCreditCardModel from './UserCreditCardModel';
import UserModel from './UserModel';
import OrderProductModel from './OrderProductModel';
import ContractModel from './ContractModel';
import UserPaymentModel from './UserPaymentModel';
import { Types } from '@ikomida/shared-types';
import ProductOptionModel from './ProductOptionModel';
import OrderProductOptionModel from './OrderProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'order',
})
export default class OrderModel extends BaseModel {
  @Column(DataType.INTEGER)
  customID?: number;
  @Column({
    type: DataType.ENUM(...Types.TOrderStatus.keys()),
  })
  status?: Types.TOrderStatus;
  @Column(DataType.DATE)
  finishedAt?: Date;
  @Column(DataType.INTEGER)
  subtotal?: number;
  @Column(DataType.INTEGER)
  delivery?: number;
  @Column(DataType.INTEGER)
  distance?: number;
  @Column(DataType.INTEGER)
  duration?: number;
  @Column(DataType.INTEGER)
  discount?: number;
  @Column(DataType.STRING(30))
  locationLatitude?: string;
  @Column(DataType.STRING(30))
  locationLongitude?: string;
  @Column(DataType.INTEGER)
  preparationMin?: number;
  @Column(DataType.INTEGER)
  preparationMax?: number;
  @Column({
    type: DataType.ENUM(...Types.TPaymentMethod.keys()),
  })
  paymentMethodType?: Types.TPaymentMethod;
  @Column({
    type: DataType.CHAR({ length: 255 }),
  })
  observation?: string;

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

  @ForeignKey(() => UserCreditCardModel)
  @Column(DataType.UUID)
  userCreditCardId?: string;
  @BelongsTo(() => UserCreditCardModel)
  userCreditCard?: UserCreditCardModel;

  @ForeignKey(() => AddressModel)
  @Column(DataType.UUID)
  addressId?: string;
  @BelongsTo(() => AddressModel)
  address?: AddressModel;

  @ForeignKey(() => CouponModel)
  @Column(DataType.UUID)
  couponId?: string;
  @BelongsTo(() => CouponModel)
  coupon?: CouponModel;

  @HasOne(() => UserPaymentModel)
  userPayment?: UserPaymentModel;

  @HasMany(() => OrderProductModel)
  orderProducts?: OrderProductModel[];

  @BelongsToMany(() => ProductOptionModel, () => OrderProductOptionModel)
  productOptions?: ProductOptionModel[];
}
