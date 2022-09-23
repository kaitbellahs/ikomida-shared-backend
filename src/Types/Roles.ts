import { Types } from '@ikomida/shared-types';

export default class Roles extends Types.TBaseType {
  //MARK: -- Internal rules
  static ADMIN = new Roles('ADMIN');
  static MANAGER = new Roles('MANAGER');
  static APP = new Roles('APP');
  static FINANCE = new Roles('FINANCE');
  static ANALYTICAL = new Roles('ANALYTICAL');
  static MARKETING = new Roles('MARKETING');

  //MARK: -- vendor rules
  static VENDOR = new Roles('VENDOR');
  static STAFF = new Roles('STAFF');

  //MARK: -- client rules
  static CLIENT = new Roles('CLIENT');

  //MARK: -- reseller rules
  static RESELLER = new Roles('RESELLER');

  //MARK: -- all
  static ALL = new Roles('ALL');

  //MARK: -- validations
  static isInternal(role: Roles) {
    return [Roles.ADMIN, Roles.MANAGER, Roles.APP, Roles.FINANCE, Roles.ANALYTICAL, Roles.MARKETING].includes(role);
  }

  static isVendor(role: Roles) {
    return [Roles.VENDOR, Roles.STAFF].includes(role);
  }

  static isClient(role: Roles) {
    return [Roles.CLIENT].includes(role);
  }

  static isReseller(role: Roles) {
    return [Roles.RESELLER].includes(role);
  }
}
