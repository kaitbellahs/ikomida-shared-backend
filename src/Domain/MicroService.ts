const port = '1988'
export default class MicroService {
  static products = `http://products-service.ikomida:${port}`
  static orders = `http://orders-service.ikomida:${port}`
  static payments = `http://payments-service.ikomida:${port}`
  static users = `http://users-service.ikomida:${port}`
  static contracts = `http://contracts-service.ikomida:${port}`
  static resellers = `http://resellers-service.ikomida:${port}`
  static vendorSettings = `http://vendors-service.ikomida:${port}`
  static pushNotification = `http://pushnotification-service.ikomida:${port}`
  static admin = `http://admin-service.ikomida:${port}`
  static generics = `http://generics-service.ikomida:${port}`
  static mq = `rabbitmq-service.ikomida`
}

// function host(service: string) {
//   const servicePortKey = `${service.toUpperCase()}_SERVICE_SERVICE_PORT`
//   if (!(servicePortKey in process.env)) {
//     return ''
//   }
//   const port = process.env[servicePortKey];
//   const serviceADDRKey = `${service.toUpperCase()}_SERVICE_PORT_${servicePortKey}_TCP_ADDR`
//   if (!(serviceADDRKey in process.env)) {
//     return ''
//   }
//   const host = process.env[serviceADDRKey];
//   return `http://${host}:${port}`;
// }
// export default class MicroService {
//   static get products() { return host('PRODUCTS') }
//   static get orders() { return host('ORDERS') }
//   static payments() { return host('PAYMENTS') }
//   static users() { return host('USERS') }
//   static contracts() { return host('CONTRACTS') }
//   static resellers() { return host('RESELLERS') }
//   static vendorSettings() { return host('VENDORS') }
//   static pushNotification() { return host('PUSHNOTIFICATION') }
//   static admin() { return host('ADMIN') }
//   static generics() { return host('GENERICS') }
//   static mq() { return host('RABBITMQ') }
// }
