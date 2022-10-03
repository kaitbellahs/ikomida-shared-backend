import { Table, Column, DataType, ForeignKey, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import AddressModel from './AddressModel';
import AppModel from './AppModel';
import BaseModel from './BaseModel';
import ContractPaymentSignatureModel from './ContractPaymentSignatureModel';
import CouponModel from './CouponModel';
import OrderModel from './OrderModel';
import PlanModel from './PlanModel';
import ReferralModel from './ReferralModel';
import TermHashModel from './TermHashModel';
import UserCreditCardModel from './UserCreditCardModel';
import UserModel from './UserModel';
import UserPaymentModel from './UserPaymentModel';
import VendorPNMessageModel from './VendorPNMessageModel';
import PNMessageModel from './PNMessageModel';
import OrderProductModel from './OrderProductModel';
import ProductCategoryModel from './ProductCategoryModel';
import ProductModel from './ProductModel';
import PNModel from './PNModel';
import PhoneValidationCodeModel from './PhoneValidationCodeModel';
import VendorPaymentGatewayModel from './VendorPaymentGatewayModel';
import VendorSettingsModel from './VendorSettingsModel';
import ContractPaymentModel from './ContractPaymentModel';
import { Types } from '@ikomida/shared-types';
import ProductOptionCategoryModel from './ProductOptionCategoryModel';
import ProductOptionModel from './ProductOptionModel';

@Table({
  paranoid: true,
  modelName: 'contract',
})
export default class ContractModel extends BaseModel {
  @Column(DataType.STRING(255))
  ikomidaID?: string;
  @Column(DataType.STRING(100))
  contractName?: string;
  @Column(DataType.STRING(25))
  contractIdentity?: string;
  @Column(DataType.STRING(255))
  email?: string;
  @Column({
    type: DataType.ENUM(...Types.TAsaasSignatureStatus.keys()),
  })
  status?: Types.TAsaasSignatureStatus;
  @Column(DataType.STRING(30))
  name?: string;
  @Column(DataType.STRING(50))
  lastName?: string;
  @Column(DataType.STRING(20))
  identity?: string;
  @Column(DataType.INTEGER({ length: 3 }))
  areaCode?: number;
  @Column(DataType.STRING(20))
  phone?: string;
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  lastOrderCustomID?: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active?: boolean;

  //MARK: --Associations
  @HasOne(() => ContractPaymentSignatureModel)
  contractPaymentSignature?: ContractPaymentSignatureModel;

  @HasOne(() => VendorSettingsModel)
  vendorSettings?: VendorSettingsModel;

  @HasOne(() => VendorPaymentGatewayModel)
  vendorPaymentGateway?: VendorPaymentGatewayModel;

  @HasMany(() => AppModel)
  apps?: AppModel[];

  @HasMany(() => UserPaymentModel)
  userPayments?: UserPaymentModel[];

  @HasMany(() => UserModel)
  users?: UserModel[];

  @HasMany(() => ContractPaymentModel)
  contractPayments?: ContractPaymentModel[];

  @HasMany(() => PNModel)
  pNs?: PNModel[];

  @HasMany(() => UserCreditCardModel)
  userCreditCards?: UserCreditCardModel[];

  @HasMany(() => CouponModel)
  coupons?: CouponModel[];

  @HasMany(() => ProductModel)
  products?: ProductModel[];

  @HasMany(() => OrderModel)
  orders?: OrderModel[];

  @HasMany(() => ProductCategoryModel)
  productCategories?: ProductCategoryModel[];

  @HasMany(() => ProductOptionCategoryModel)
  productOptionCategories?: ProductOptionCategoryModel[];

  @HasMany(() => ProductOptionModel)
  productOptions?: ProductOptionModel[];

  @HasMany(() => OrderProductModel)
  orderProducts?: OrderProductModel[];

  @HasMany(() => VendorPNMessageModel)
  vendorPNMessages?: VendorPNMessageModel[];

  @HasMany(() => TermHashModel)
  termHashs?: TermHashModel[];

  @HasMany(() => PNMessageModel)
  pNMessages?: PNMessageModel[];

  @HasMany(() => PhoneValidationCodeModel)
  phoneValidationCodes?: PhoneValidationCodeModel[];

  @HasMany(() => AddressModel)
  addresses?: AddressModel[];

  @ForeignKey(() => PlanModel)
  @Column(DataType.UUID)
  planId?: string;
  @BelongsTo(() => PlanModel)
  plan?: PlanModel;

  @ForeignKey(() => ReferralModel)
  @Column(DataType.UUID)
  referralId?: string;
  @BelongsTo(() => ReferralModel)
  referral?: ReferralModel;

  @ForeignKey(() => ReferralModel)
  @Column(DataType.UUID)
  referredById?: string;
  @BelongsTo(() => ReferralModel)
  referredBy?: ReferralModel;
}
