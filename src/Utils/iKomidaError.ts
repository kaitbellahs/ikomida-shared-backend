import Logger from './Logger.js'
import Return from './Return.js'
export interface IiKomidaErrorModel {
  code: string
  message: string
}
export interface IiKomidaError {
  code: string
  message: string
  errors: string
}
export default class iKomidaError {
  code?: string
  message?: string
  status?: number
  errors: any[] = []

  constructor(error: IiKomidaErrorModel, ...args: any[]) {
    if (error) {
      this.code = error.code
      this.message = error.message
      if ((args?.length ?? 0) > 0) {
        const params: any[] = []
        for (const arg of args) {
          if (typeof arg === 'string') {
            params.push(arg)
          } else {
            this.errors.push(arg)
          }
        }
        this.message =
          this.message?.replace(/{(\d+)}/g, (match, index) =>
            params?.[index] ? this.isJsonObject(params[index]) : match
          ) || this.message
      }
    }
  }

  setStatus(status: number) {
    this.status = status
  }

  isJsonObject(object: any) {
    try {
      if (typeof object === 'object') {
        return JSON.stringify(object)
      }
    } catch (e) {
      console.error(e)
    }
    return object
  }

  log(logger: Logger) {
    logger.error(this.json())
  }

  json(): IiKomidaError {
    return {
      code: this.code,
      message: this.message,
      errors: this.errors
    } as unknown as IiKomidaError
  }

  fromJson(object: iKomidaError) {
    this.code = object?.code
    this.message = object?.message
    this.errors = object?.errors
  }

  logAndReturn(logger: Logger) {
    this.log(logger)
    return new Return(false, this.json(), this.status)
  }

  //MARK: -MQ Service lib
  static MQ_GET_CHANNEL: IiKomidaErrorModel = {
    code: 'MQ0001',
    message: 'Não foi possível abrir um canal: '
  }
  static MQ_CLOSE_CHANNEL: IiKomidaErrorModel = {
    code: 'MQ0002',
    message: 'Não foi possível fechar o canal: '
  }
  static MQ_PUBLISH: IiKomidaErrorModel = {
    code: 'MQ0003',
    message: 'Não foi possível publicar no canal:: '
  }
  static MQ_LISTEN_TO_MESSAGES: IiKomidaErrorModel = {
    code: 'MQ0004',
    message: 'Não foi possível abrir o canal:: '
  }

  //MARK: - ASAAS payment lib
  static ASAAS_NEW_CUSTOMER_OBJECT_MISSING_DATA: IiKomidaErrorModel = {
    code: 'AS0001',
    message: 'Está faltando alguns dados do cliente.'
  }
  static ASAAS_NEW_CUSTOMER_ADDRESS_OBJECT_MISSING_DATA: IiKomidaErrorModel = {
    code: 'AS0002',
    message: 'Está faltando alguns dados do objeto do endereço cliente.'
  }
  static ASAAS_NEW_CUSTOMER_CREATE_FAILED_1: IiKomidaErrorModel = {
    code: 'AS0003',
    message: 'Não foi possível criar um novo cliente: {0}'
  }
  static ASAAS_NEW_CUSTOMER_CREATE_FAILED_2: IiKomidaErrorModel = {
    code: 'AS0004',
    message: 'Não foi possível criar um novo cliente'
  }
  static ASAAS_NEW_CUSTOMER_CREATE_FAILED_3: IiKomidaErrorModel = {
    code: 'AS0005',
    message: 'Não foi possível criar um novo cliente: erro externo'
  }
  static ASAAS_SUBSCRIPTION_OBJECT: IiKomidaErrorModel = {
    code: 'AS0006',
    message: 'Está faltando campos no objeto do cadastro'
  }
  static ASAAS_SUBSCRIPTION_CREATE_CUSTOMER: IiKomidaErrorModel = {
    code: 'AS0007',
    message: 'Não foi possível criar um novo cliente'
  }
  static ASAAS_SUBSCRIPTION_PLANE_OBJECT: IiKomidaErrorModel = {
    code: 'AS008',
    message: 'Está faltando campos no objeto do plano'
  }
  static ASAAS_SUBSCRIPTION_PAYMENT_OBJECT: IiKomidaErrorModel = {
    code: 'AS0009',
    message: 'Está faltando campos no objeto do pagamento'
  }
  static ASAAS_SUBSCRIPTION_FAILED_1: IiKomidaErrorModel = {
    code: 'AS0010',
    message: 'Não foi possível criar uma inscrição pagamento: {0}'
  }
  static ASAAS_SUBSCRIPTION_FAILED_2: IiKomidaErrorModel = {
    code: 'AS0011',
    message: 'Não foi possível criar uma inscrição pagamento'
  }
  static ASAAS_SUBSCRIPTION_FAILED_3: IiKomidaErrorModel = {
    code: 'AS0012',
    message: 'Não foi possível criar uma inscrição pagamento: erro externo'
  }

  //MARK: -- PAGSEGURO payment lib
  static PAGSEGURO_CREATE_CHARGE_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PS0001',
    message: 'Está faltando dados no objeto da criação de cobranças'
  }
  static PAGSEGURO_CREATE_CHARGE_MISSING_CARD_DATA: IiKomidaErrorModel = {
    code: 'PS0002',
    message: 'Está faltando dados no objeto do cartão para de cobranças'
  }
  static PAGSEGURO_CREATE_CHARGE_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0003',
    message: 'Não foi possível criar cobrança: {0}'
  }
  static PAGSEGURO_CREATE_CHARGE_FAILED_2: IiKomidaErrorModel = {
    code: 'PS0004',
    message: 'Não foi possível criar cobrança'
  }
  static PAGSEGURO_CREATE_CHARGE_FAILED_3: IiKomidaErrorModel = {
    code: 'PS0005',
    message: 'Não foi possível criar cobrança: erro externo'
  }
  static PAGSEGURO_CANCEL_CHARGE_MISSING_CARD_DATA: IiKomidaErrorModel = {
    code: 'PS0006',
    message: 'Está faltando dados no objeto para cancelar cobrança'
  }
  static PAGSEGURO_CANCEL_CHARGE_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0007',
    message: 'Não foi possível cancelar cobrança: {0}'
  }
  static PAGSEGURO_CANCEL_CHARGE_FAILED_2: IiKomidaErrorModel = {
    code: 'PS0008',
    message: 'Não foi possível criar cobrança'
  }
  static PAGSEGURO_CANCEL_CHARGE_FAILED_3: IiKomidaErrorModel = {
    code: 'PS0009',
    message: 'Não foi possível criar cobrança: erro externo'
  }
  static PAGSEGURO_CREATE_REVOKE_TOKEN_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0011',
    message: 'Não foi possível revocar token: '
  }
  static PAGSEGURO_CREATE_APP_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0012',
    message: 'Não foi possível criar a applicacao: '
  }
  static PAGSEGURO_GET_APP_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0013',
    message: 'Não foi possível obter a applicacao: '
  }
  static PAGSEGURO_GET_ACCESS_TOKEN_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0014',
    message: 'Não foi possível obter a token de acesso: '
  }
  static PAGSEGURO_REFRESH_ACCESS_TOKEN_FAILED_1: IiKomidaErrorModel = {
    code: 'PS0015',
    message: 'Não foi possível atualizar a token de acesso: '
  }

  //MARK: -- Google admin lib
  static GOOGLE_ADMIN_GET_ACCESS_TOKEN: IiKomidaErrorModel = {
    code: 'GA0001',
    message: 'Não foi possível obter token de acesso'
  }
  static GOOGLE_ADMIN_CREATE_NEW_ANDROID_APP: IiKomidaErrorModel = {
    code: 'GA0002',
    message: 'Não foi possível criar app Android'
  }
  static GOOGLE_ADMIN_CREATE_NEW_IOS_APP: IiKomidaErrorModel = {
    code: 'GA0003',
    message: 'Não foi possível criar app iOS'
  }
  static GOOGLE_ADMIN_GET_CURRENT_ANDROID_CONFIG: IiKomidaErrorModel = {
    code: 'GA0004',
    message: 'Não foi possível obter arquivo de configurações de android: {0}'
  }
  static GOOGLE_ADMIN_GET_CURRENT_IOS_CONFIG: IiKomidaErrorModel = {
    code: 'GA0005',
    message: 'Não foi possível obter arquivo de configurações de iOS'
  }
  static GOOGLE_ADMIN_SEND_PUSH_NOTIFICATION: IiKomidaErrorModel = {
    code: 'GA0006',
    message: 'Não foi possível enviar push notification'
  }
  static IKOMIDA_ADMIN_SERVICE_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'GA0006',
    message: 'Operação Não autorizada'
  }

  //MARK: --Contract microservice
  static IKOMIDA_CONTRACT_SERVICE_OBJECT_OR_PLANE_MODIFIED: IiKomidaErrorModel = {
    code: 'PCS001',
    message: 'O objeto do cadastro ou plano foi modificado'
  }
  static IKOMIDA_CONTRACT_SERVICE_USER_ALREADY_USED: IiKomidaErrorModel = {
    code: 'PCS002',
    message: 'Usuário encontra se em uso'
  }
  static IKOMIDA_CONTRACT_SERVICE_RESTAURANT_ALREADY_REGISTERED: IiKomidaErrorModel = {
    code: 'PCS003',
    message: 'O restaurante encontra-se cadastrado'
  }
  static IKOMIDA_CONTRACT_SERVICE_NEW_CONTRACT_EXCEPTION: IiKomidaErrorModel = {
    code: 'PCS004',
    message: 'Não foi possível gerar o contrato: {0}'
  }
  static IKOMIDA_CONTRACT_SERVICE_UNEXPECTED_ERROR: IiKomidaErrorModel = {
    code: 'PCS005',
    message: 'Ocorreu um erro inesperado'
  }
  static IKOMIDA_CONTRACT_SERVICE_GATEWAY_ERROR: IiKomidaErrorModel = {
    code: 'PCS006',
    message: 'Erro ao tentar criar assinatura: {0}'
  }
  static IKOMIDA_CONTRACT_SERVICE_GET_PLANS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PCS007',
    message: 'Erro ao tentar criar assinatura: {0}'
  }
  static IKOMIDA_CONTRACT_SERVICE_CREATE_PHONE_VALIDATION_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PCS008',
    message: 'Não foi possivel gerar o código de validação'
  }
  static IKOMIDA_CONTRACT_SERVICE_CREATE_PHONE_VALIDATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PCS009',
    message: 'Ocorreu um erro inesperado: {0}'
  }
  static IKOMIDA_CONTRACT_SERVICE_CREATE_LISTNING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PCS010',
    message: 'Erro ao tentar abrir uma conexão: {0}'
  }

  //MARK: -- gateway microserice
  static IKOMIDA_GATEWAY_SERVICE_AUTH_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PGS001',
    message: 'Está faltando dados do objeto de autenticação'
  }
  static IKOMIDA_GATEWAY_SERVICE_AUTH_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PGS002',
    message:
      'Um ou mais dos credenciais inseridos não está/estão correto(s), se você não lembra da sua senha clique no botão “RECUPERAR SENHA”{0}'
  }
  static IKOMIDA_GATEWAY_SERVICE_AUTH_EXCEPTION: IiKomidaErrorModel = {
    code: 'PGS003',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_AUTHENTICATION: IiKomidaErrorModel = {
    code: 'PGS004',
    message: 'Falha na authenticação'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_NAME: IiKomidaErrorModel = {
    code: 'PGS005',
    message: 'O nome está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_LAST_NAME: IiKomidaErrorModel = {
    code: 'PGS006',
    message: 'O sobrenome está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_CPF: IiKomidaErrorModel = {
    code: 'PGS007',
    message: 'O CPF está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_EMAIL: IiKomidaErrorModel = {
    code: 'PGS008',
    message: 'O email está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_PHONE: IiKomidaErrorModel = {
    code: 'PGS009',
    message: 'O telefone está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_PASSWORD: IiKomidaErrorModel = {
    code: 'PGS010',
    message: 'A senha está faltando o invalida'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PGS011',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_UNKNOWN: IiKomidaErrorModel = {
    code: 'PGS012',
    message: 'Erro não identificado'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_AUTHENTICATION: IiKomidaErrorModel = {
    code: 'PGS013',
    message: 'Falha na authenticação'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_NAME: IiKomidaErrorModel = {
    code: 'PGS014',
    message: 'O nome está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_LAST_NAME: IiKomidaErrorModel = {
    code: 'PGS015',
    message: 'O sobrenome está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_CPF: IiKomidaErrorModel = {
    code: 'PGS016',
    message: 'O CPF está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_EMAIL: IiKomidaErrorModel = {
    code: 'PGS017',
    message: 'O email está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_PHONE: IiKomidaErrorModel = {
    code: 'PGS018',
    message: 'O telefome está faltando o invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_PASSWORD: IiKomidaErrorModel = {
    code: 'PGS019',
    message: 'A senha  está faltando o invalida'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_MISSING_SIGNATURE: IiKomidaErrorModel = {
    code: 'PGS020',
    message: 'A assinatura digital está faltando o invalida'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PGS021',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_UNKNOWN: IiKomidaErrorModel = {
    code: 'PGS022',
    message: 'Erro não identificado'
  }
  static IKOMIDA_GATEWAY_SERVICE_NEW_USER_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PGS023',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_GATEWAY_SERVICE_NEW_USER_INVALID_PHONE_VALIDATION_CODE: IiKomidaErrorModel = {
    code: 'PGS024',
    message: 'Código de verificação invalido'
  }
  static IKOMIDA_GATEWAY_SERVICE_NEW_USER_EXCEPTION: IiKomidaErrorModel = {
    code: 'PGS025',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_GATEWAY_SERVICE_NEW_USER_UNKNOWN: IiKomidaErrorModel = {
    code: 'PGS026',
    message: 'Erro não identificado'
  }
  static IKOMIDA_GATEWAY_SERVICE_AUTH_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PGS027',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PGS028',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_GATEWAY_SERVICE_VALIDATE_PHONE_VALIDATION_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PGS029',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_LISTNING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PGS031',
    message: 'Erro ao tentar abrir uma conexão: {0}'
  }
  static IKOMIDA_CONTRACT_SERVICE_INVALID_TERM_ID: IiKomidaErrorModel = {
    code: 'PGS032',
    message: 'O termo de uso especificado não foi encontrado.'
  }
  static IKOMIDA_GATEWAY_SERVICE_CREATE_PHONE_VALIDATION_MISSING_TERM: IiKomidaErrorModel = {
    code: 'PGS033',
    message: 'O termo de uso especificado não foi encontrado.'
  }
  static IKOMIDA_GATEWAY_SERVICE_NEW_USER_ALREADY_EXIST: IiKomidaErrorModel = {
    code: 'PGS034',
    message: 'O número de telefone e/ou CPF informado encontra-se em uso.'
  }
  static IKOMIDA_GATEWAY_SERVICE_AUTH_MULTI_DEVICE: IiKomidaErrorModel = {
    code: 'PGS035',
    message:
      'Esta conta está vinculada com outro dispositivo, por favor desvincule sua conta no outro dispositivo volte a fazer o login aqui!'
  }
  static IKOMIDA_GATEWAY_SERVICE_AUTH_TOO_MANY_ATEMPTS: IiKomidaErrorModel = {
    code: 'PGS035',
    message:
      'Detectamos varias tentativas de login sem sucesso na sua conta e para a sua segurança o seu acesso foi bloqueado por {0} minutos, volte a tentar fazer login novamente após {1} minutos, ou clique no botão "RECUPERAR SENHA” para recuperar a sua senha!'
  }

  //MARK: -- notification microservice
  static IKOMIDA_NOTIFICATION_SERVICE_REGISTER_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PNS001',
    message: 'Está faltando dados do objeto de autenticação'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_REGISTER_CONTRACT: IiKomidaErrorModel = {
    code: 'PNS002',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_REGISTER_EXCEPTION: IiKomidaErrorModel = {
    code: 'PNS003',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_REGISTER_INVALID_USER: IiKomidaErrorModel = {
    code: 'PNS004',
    message: 'O usuário não foi localizado'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_NEW_PUSH_NOTIFICATION_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PNS005',
    message: 'Está faltando dados para poder enviar sua mensagem!'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_GET_MESSAGES_CONTRACT: IiKomidaErrorModel = {
    code: 'PNS006',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_NEW_PUSH_NOTOFOCATION_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'PNS007',
    message:
      'O limite de envio de mensagens push neste período foi atingido, por favor entre em contato conosco para resolver esta limitação!'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_NEW_PUSH_NOTOFOCATION_PUSH_NOTIFICATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PNS008',
    message: 'Ocorreu um erro ao tentar enviar mensagem push'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_NEW_PUSH_NOTOFOCATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PNS009',
    message: 'Ocorreu um erro ao tentar enviar mensagem push'
  }
  static IKOMIDA_NOTIFICATION_SERVICE_GET_PUSH_NOTOFOCATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PNS010',
    message: 'Ocorreu um erro ao tentar obter lista de mensagens push'
  }

  //MARK: -- Orders microservice
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCT_NOT_EXIST: IiKomidaErrorModel = {
    code: 'POS001',
    message: 'O produto que você selecionou não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_CONFLICT: IiKomidaErrorModel = {
    code: 'POS002',
    message: 'Conflito, mais de um produto com as mesmas características foi encontrado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_QUANTITY: IiKomidaErrorModel = {
    code: 'POS003',
    message: 'A quantidade do "{0}" é insuficiente!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_PRICE: IiKomidaErrorModel = {
    code: 'POS004',
    message: 'O preço do "{0}" foi alterado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_NAME: IiKomidaErrorModel = {
    code: 'POS005',
    message: 'O nome do "{0}" foi alterado'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_PAYMENT_METHOD_NOT_DEFINED: IiKomidaErrorModel = {
    code: 'POS006',
    message: 'O método de pagamento não foi definido!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_COUPON_NOT_VALID: IiKomidaErrorModel = {
    code: 'POS007',
    message: 'O coupon inserido não é válido!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_PAYMENT_METHOD_NOT_VALID: IiKomidaErrorModel = {
    code: 'POS008',
    message: 'O meio de pagamento escolhido não é válido!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_ADDRESS_NOT_VALID: IiKomidaErrorModel = {
    code: 'POS009',
    message: 'O endereço não foi preenchido ou não é válido!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_PAYMENT_RESPONSE_INVILID: IiKomidaErrorModel = {
    code: 'POS0010',
    message: 'Não foi possível realizar a cobrança. o seu pedido será cancelado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_PAYMENT_EXCEPTION: IiKomidaErrorModel = {
    code: 'POS011',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_EXCEPTION: IiKomidaErrorModel = {
    code: 'POS012',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_MISSING_OBJECT: IiKomidaErrorModel = {
    code: 'POS013',
    message: 'Está faltando campos no objeto'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_ORDER_NOT_FOUND: IiKomidaErrorModel = {
    code: 'POS014',
    message: 'O pedido não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_WAITING_PAYMENT: IiKomidaErrorModel = {
    code: 'POS015',
    message: 'não foi possível alterar o estado do pedido (Pedido aguardando pagamento)!'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_PAYMENT_CANCEL_RESPONSE: IiKomidaErrorModel = {
    code: 'POS016',
    message: 'Ocorreu erro ao tentar cancelar o pagamento, entre em contato com o suporte!'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_PAYMENT_EXCEPTION: IiKomidaErrorModel = {
    code: 'POS017',
    message: 'Ocorreu erro ao tentar cancelar o pagamento, entre em contato com o suporte: "{0}"!'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_PAYMENT_CANCEL_ERROR: IiKomidaErrorModel = {
    code: 'POS018',
    message: 'Ocorreu erro ao tentar cancelar o pagamento, entre em contato com o suporte: "{0}"!'
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_PAYMENT_CANCEL_ERROR_2: IiKomidaErrorModel = {
    code: 'POS019',
    message: 'Foi recebida uma resposta inesperada ao tentar cancelar o pagamento!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'POS020',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_INVALID_USER: IiKomidaErrorModel = {
    code: 'POS021',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_GET_ORDERS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'POS022',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_GET_ORDERS_COUNT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'POS023',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_GET_ORDERS_INVALID_USER: IiKomidaErrorModel = {
    code: 'POS024',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_INVALID_ORDER: IiKomidaErrorModel = {
    code: 'POS025',
    message: 'O pedido não é válido!'
  }
  static IKOMIDA_VENDOR_SERVICE_REVOKE_PAGSEGURO_INVALID_VENDOR_PAYMENT_SETTINGS: IiKomidaErrorModel = {
    code: 'POS026',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_DELIVERY_NOT_VALID: IiKomidaErrorModel = {
    code: 'POS027',
    message: 'O valor do delivery está incorreto ou alterado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_EMPTY: IiKomidaErrorModel = {
    code: 'POS028',
    message: 'O objeto responsável pela criação do pedido encontra-se vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_NEW_ORDER_EMPTY_OBJECT: IiKomidaErrorModel = {
    code: 'POS029',
    message: 'O objeto responsável pela criação do pedido encontra-se vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_REVOKE_PAGSEGURO_INVALID_VENDOR_SETTINGS: IiKomidaErrorModel = {
    code: 'POS029',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_CONFLICT_1: IiKomidaErrorModel = {
    code: 'POS030',
    message: 'Conflito, mais de um produto com as mesmas características foi encontrado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_PRODUCTS_CONFLICT_2: IiKomidaErrorModel = {
    code: 'POS031',
    message: 'Conflito, mais de um produto com as mesmas características foi encontrado!'
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'POS032',
    message: `O limite de criação de novos pedidos foi atingido, por favor entre em contato conosco para resolver esta limitação!`
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_BILLING_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'POS033',
    message: `O limite de criação de novos pedidos foi atingido, por favor entre em contato conosco para resolver esta limitação!`
  }
  static IKOMIDA_ORDER_SERVICE_NEW_ORDER_OUT_OF_SERVICE: IiKomidaErrorModel = {
    code: 'POS034',
    message: `Estamos fora do horário de funcionamento, por favor verifique o nosso horário de funcionamento e volte a pedir mais tarde!`
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_WRONG_STATUS: IiKomidaErrorModel = {
    code: 'POS035',
    message: `Não conseguimos achar o status correto do pedido, tente de novo!`
  }
  static IKOMIDA_ORDERS_SERVICE_CHANGE_ORDER_STATUS_ERROR: IiKomidaErrorModel = {
    code: 'POS036',
    message: `Não foi possível cancelar seu pedido por favor, tente novamente em instantes!`
  }
  static IKOMIDA_ORDERS_SERVICE_NEW_ORDER_INVALID_AMOUNT: IiKomidaErrorModel = {
    code: 'POS037',
    message: `O valor total cobrado nesse pedido é maior que R$ 9.999.999,99 , o pedido será cancelado.!`
  }

  //MARK: -- payments microservice
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_VENDOR_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS001',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos, entre em contato com o estabelecimento!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_VENDOR_PAYMENT_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS002',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos, entre em contato com o estabelecimento!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_RESPONSE_ERROR: IiKomidaErrorModel = {
    code: 'PPS003',
    message: 'Resposta da gateway de pagamento: {0}!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_USER: IiKomidaErrorModel = {
    code: 'PPS004',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_VENDOR_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS005',
    message: 'As configurações de recebimento de pagamento do estabelecimento encontram-se inválidas!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_VENDOR_PAYMENT_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS006',
    message: 'As configurações de recebimento de pagamento do estabelecimento encontram-se inválidas!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_PAYMENT_PAYMENT_METHOD: IiKomidaErrorModel = {
    code: 'PPS007',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_CREATE_CHARGE_ERROR: IiKomidaErrorModel = {
    code: 'PPS008',
    message: 'Não foi possível criar uma cobrança!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_ADD_COUPON_ERROR: IiKomidaErrorModel = {
    code: 'PPS009',
    message: 'Erro ao tentar adicionar um novo coupon!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_COUPON_VENDOR: IiKomidaErrorModel = {
    code: 'PPS010',
    message: 'O usuário não é autorizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_REMOVE_COUPON_VENDOR: IiKomidaErrorModel = {
    code: 'PPS011',
    message: 'O usuário não é autorizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_GET_COUPON_VENDOR: IiKomidaErrorModel = {
    code: 'PPS012',
    message: 'O usuário não é autorizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD: IiKomidaErrorModel = {
    code: 'PPS013',
    message: 'Ocorreu um erro: {0}!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS014',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_COUPON_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS015',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_EXCEPTION: IiKomidaErrorModel = {
    code: 'PPS016',
    message: 'Ocorreu um erro inesperado {0}!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_INVALID_USER: IiKomidaErrorModel = {
    code: 'PPS017',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS018',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_GET_PAYMENTS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS019',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_GET_PAYMENTS_INVALID_USER: IiKomidaErrorModel = {
    code: 'PPS020',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS021',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_ADD_COUPON_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS022',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_INVALID_PAYMENTS: IiKomidaErrorModel = {
    code: 'PPS023',
    message: 'Erro ao tentar obter cobranças!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_REMOVE_COUPON_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS024',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_GET_COUPON_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS025',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_GET_COUPONS_COUNT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS026',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_INVALID_USER: IiKomidaErrorModel = {
    code: 'PPS027',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_CANCEL_PAYMENT_INVALID_USER_PAYMENT: IiKomidaErrorModel = {
    code: 'PPS028',
    message: 'O meio de pagamento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_REMOVE_COUPON_COUPON_NOT_FOUND: IiKomidaErrorModel = {
    code: 'PPS029',
    message: 'O coupon não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_INVALID_PAYMENT_SIGNATURE: IiKomidaErrorModel = {
    code: 'PPS030',
    message: 'A assinatura digital enconta-se inválida!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_INVALID_PLAN: IiKomidaErrorModel = {
    code: 'PPS031',
    message: 'O plano não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PAGSEGUROWEBHOOK_EXCEPTION: IiKomidaErrorModel = {
    code: 'PPS032',
    message: 'Ocorreu um erro inesperado ao receber um pagseguro webhook: {0}'
  }
  static IKOMIDA_PAYMENTS_SERVICE_ASAASWEBHOOK_EXCEPTION: IiKomidaErrorModel = {
    code: 'PPS033',
    message: 'Ocorreu um erro inesperado ao receber um Asaas webhook {0}'
  }
  static IKOMIDA_PAYMENTS_SERVICE_ASAAS_WEBHOOK_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS034',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_ASAASWEBHOOK_PUSH_NOTIFICATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PPS035',
    message: 'Não foi possível enviar push notification! : {0}'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PAGSEGURO_WEBHOOK_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPS036',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PAGSEGURO_WEBHOOK_VENDOR_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS037',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos, entre em contato com o estabelecimento!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PAGSEGURO_WEBHOOK_VENDOR_PAYMENT_SETTINGS: IiKomidaErrorModel = {
    code: 'PPS038',
    message: 'Os dados de recebimento de pagamento encontram-se inválidos, entre em contato com o estabelecimento!'
  }
  static IKOMIDA_PAYMENTS_SERVICE_PAGSEGURO_WEBHOOK_INVALID_USER: IiKomidaErrorModel = {
    code: 'PPS039',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_ORDERS_SERVICE_PAGSEGURO_WEBHOOK_PUSH_NOTIFICATION_EXCEPTION: IiKomidaErrorModel = {
    code: 'PPS040',
    message: 'Não foi possível enviar push notification! : {0}'
  }
  static IKOMIDA_ORDERS_SERVICE_PAGSEGURO_WEBHOOK_PUSH_NOTIFICATION_EXCEPTION_2: IiKomidaErrorModel = {
    code: 'PPS041',
    message: 'Não foi possível enviar push notification! : {0}'
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_COUPON_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'PPRS013',
    message: `O seu plano permite adição de até {0} cupons, e esse limite foi atingido.
        para adicionar mais cupons, por favor faça um upgrade do seu plano
        !`
  }
  static IKOMIDA_PAYMENTS_SERVICE_PROCESS_PAYMENT_INVALID_RECAPTCHA: IiKomidaErrorModel = {
    code: 'PPRS014',
    message: `Alguma coisa deu errado, por favor tente mais tarde!`
  }
  static IKOMIDA_PAYMENTS_SERVICE_ASAAS_WEBHOOK_CANT_GET_SUBSCRIPTION: IiKomidaErrorModel = {
    code: 'PPRS015',
    message: `Nao foi possivel obter objeto da inscrecao apartir de Asaas api!`
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PPRS016',
    message: `por favor preencha todos os dados do cartão de crédito!`
  }
  static IKOMIDA_PAYMENTS_SERVICE_NEW_PAYMENT_METHOD_CANT_ADD_TO_CANCEL_QUEUE: IiKomidaErrorModel = {
    code: 'PPRS017',
    message: `Nao foi possivel addicionar pedido de cancelamento de cubranca para fila!`
  }
  static IKOMIDA_PAYMENTS_SERVICE_ADD_COUPON_NOT_FOUND: IiKomidaErrorModel = {
    code: 'PPRS018',
    message: `Nenhum cupom com o nome digitado foi encontrado, verifique também a data da validade do cupom.!`
  }

  //MARK: -- products microservice
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PPRS001',
    message: 'Usuário não autorizado para realizar esta operação!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_INVALID_CATEGORY: IiKomidaErrorModel = {
    code: 'PPRS002',
    message: 'A categoria escolhida não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PPRS003',
    message: 'Usuário não autorizado para realizar esta operação!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_INVALID_CATEGORY: IiKomidaErrorModel = {
    code: 'PPRS004',
    message: 'A categoria escolhida não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_INVALID_PRODUCT: IiKomidaErrorModel = {
    code: 'PPRS005',
    message: 'O produto não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_CATEGORY_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PPRS006',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_CATEGORY_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PPRS007',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPRS008',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPRS009',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_CATEGORY_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PPRS010',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_UPLOAD_IMAGE: IiKomidaErrorModel = {
    code: 'PPRS011',
    message: 'Erro ao tentar carregar imagem para google storage! {0}'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_UPLOAD_IMAGE: IiKomidaErrorModel = {
    code: 'PPRS012',
    message: 'Erro ao tentar carregar imagem para google storage! {0}'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'PPRS013',
    message: `O seu plano permite adição de até {0} produtos, e esse limite foi atingido.
        para adicionar mais produtos, por favor faça um upgrade do seu plano
        !`
  }

  //MARK: -- Users microservice
  static IKOMIDA_USERS_SERVICE_ADDRESS_NEW_ADDRESS_INVALID_ADDRESS: IiKomidaErrorModel = {
    code: 'PUS001',
    message: 'O endereço não é válido!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_NEW_ADDRESS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS002',
    message: 'O Ocorreu um erro inesperado, {0}!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_INVALID_POSTAL_CODE: IiKomidaErrorModel = {
    code: 'PUS003',
    message: 'O CEP não é válido!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_NETWORK_ERROR: IiKomidaErrorModel = {
    code: 'PUS004',
    message: 'Erro de comunicacao ou CEP não é válido!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS005',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_NEW_ADDRESS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PUS006',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_NEW_ADDRESS_INVALID_USER: IiKomidaErrorModel = {
    code: 'PUS007',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_INVALID_USER: IiKomidaErrorModel = {
    code: 'PUS008',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_GET_ADDRESS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PUS009',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS010',
    message: 'Erro interno do serviço: {0}'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PUS011',
    message: 'O estabelecimento não foi localizado'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_INVALID_USER: IiKomidaErrorModel = {
    code: 'PUS012',
    message: 'O usuário não foi localizado'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_INVALID_PASSWORD: IiKomidaErrorModel = {
    code: 'PUS013',
    message: 'Senha invalida'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_AUTH_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PUS014',
    message: 'Senha invalida'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_INVALID_NEW_PASSWORD: IiKomidaErrorModel = {
    code: 'PUS015',
    message: 'Nova senha invalida'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_INVALID_RE_NEW_PASSWORD: IiKomidaErrorModel = {
    code: 'PUS016',
    message: 'Nova senha e a confirmação invalida'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_PASSWORD_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PUS017',
    message: 'Está faltando dados do objeto da senha'
  }
  static IKOMIDA_USERS_SERVICE_GET_SETTINGS_EMPTY: IiKomidaErrorModel = {
    code: 'PUS018',
    message: 'O objeto encontra-se vazio'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_ADDRESS_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PUS019',
    message: 'Está faltando dados do objeto do endereço'
  }
  static IKOMIDA_USERS_SERVICE_REMOVE_ADDRESS_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PUS020',
    message: 'Está faltando dados do objeto do endereço'
  }
  static IKOMIDA_USERS_SERVICE_UPDATE_ADDRESS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS021',
    message: 'Ocorreu um erro inesperado: {0}'
  }
  static IKOMIDA_USERS_SERVICE_REMOVE_ADDRESS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS022',
    message: 'Ocorreu um erro inesperado: {0}'
  }
  static IKOMIDA_USERS_SERVICE_CREATE_OBJECTS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS023',
    message: 'Error when trying to create class objects: {0}'
  }
  static IKOMIDA_USERS_SERVICE_CREATE_USER_OBJECT_EXCEPTION: IiKomidaErrorModel = {
    code: 'PUS024',
    message: 'Error when trying to create user object: {0}'
  }
  static IKOMIDA_USERS_SERVICE_GET_SETTINGS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PUS025',
    message: 'Error when trying to create user object: {0}'
  }

  // Mark: -- products microservice
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_CATEGORY_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS001',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_GET_PRODUCTS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS002',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_GET_PRODUCTS_COUNT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS003',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_GET_CATEGORIES_COUNT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS004',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_PRODUCT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS005',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_CATEGORIES_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS006',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_PRODUCT_NOT_FOUND: IiKomidaErrorModel = {
    code: 'PRS007',
    message: 'O produto não foi encontrado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_CATEGORIES_NOT_FOUND: IiKomidaErrorModel = {
    code: 'PRS008',
    message: 'A categoria do produtos não foi encontrada!'
  }
  static IKOMIDA_USERS_SERVICE_ADDRESS_NEW_ADDRESS_ADDRESS_NOT_FOUND: IiKomidaErrorModel = {
    code: 'PRS009',
    message: 'O endereço não foi encontrado!'
  }
  static IKOMIDA_USERS_SERVICE_USERS_GET_USER_COUNT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PRS010',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_EDIT_CATEGORY_INVALID_CATEGORY: IiKomidaErrorModel = {
    code: 'PRS011',
    message: 'A categoria escolhida não foi localizada!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_GET_PRODUCT_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PRS012',
    message: 'Está faltando dados ou dados incorretos para concluir sua chamada!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_PRODUCT_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PRS013',
    message: 'Está faltando dados ou dados incorretos para concluir sua chamada!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_DELETE_CATEGORY_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PRS014',
    message: 'Está faltando dados ou dados incorretos para concluir sua chamada!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_GET_PRODUCT_NOT_FOUNT: IiKomidaErrorModel = {
    code: 'PRS015',
    message: 'O produto solicitado não foi encontrado ou foi removido!!'
  }
  static IKOMIDA_PRODUCTS_SERVICE_NEW_PRODUCT_EXCEPTION: IiKomidaErrorModel = {
    code: 'PRS016',
    message: 'Ocurreu um erro inesperado, tente novamente mais tarde!'
  }

  //MARK: -- Vendor microservice
  static IKOMIDA_VENDOR_SERVICE_GET_SETTINGS_EMPTY: IiKomidaErrorModel = {
    code: 'PVS001',
    message: 'O objeto das configurações está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_LAYOUT_EMPTY: IiKomidaErrorModel = {
    code: 'PVS002',
    message: 'O objeto do layout está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_SETTINGS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS003',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_GET_SETTINGS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS004',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_LAYOUT_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS005',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_LAYOUTS_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PVS007',
    message: 'Está faltando dados do objeto do layout!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_PROFILE_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PVS008',
    message: 'Está faltando dados do objeto do perfil!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PVS008',
    message: 'Está faltando dados do objeto do layout!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_BUSNIESS_HOURS_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PVS008',
    message: 'Está faltando dados do objeto de integração do pagseguro!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_DELIVERY_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PVS008',
    message: 'Está faltando dados do objeto do delivery!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_PROFILE_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS009',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS010',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_REVOKE_PAGSEGURO_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS011',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_BUSNIESS_HOURS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS012',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_DELIVERY_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS012',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_GET_LAYOUTS_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS013',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_GET_PAGSEGURO_URL_INVALID_CONTRACT: IiKomidaErrorModel = {
    code: 'PVS014',
    message: 'O estabelecimento não foi localizado!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_LAYOUT_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS015',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_PROFILE_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS016',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS017',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_SET_REVOKE_PAGSEGURO_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS017',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_BUSNIESS_HOURS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS018',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_DELIVERY_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS019',
    message: 'O Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_PROFILE_EMPTY: IiKomidaErrorModel = {
    code: 'PVS020',
    message: 'O objeto do perfil está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_EMPTY: IiKomidaErrorModel = {
    code: 'PVS021',
    message: 'O objeto de integração do pagseguro está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_BUSNIESS_HOURS_EMPTY: IiKomidaErrorModel = {
    code: 'PVS022',
    message: 'O objeto do horário de funcionamento está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_DELIVERY_EMPTY: IiKomidaErrorModel = {
    code: 'PVS023',
    message: 'O objeto do delivery está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_GET_LAYOUTS_EMPTY: IiKomidaErrorModel = {
    code: 'PVS024',
    message: 'O objeto do layout está vazio!'
  }
  static IKOMIDA_VENDOR_SERVICE_UPDATE_PROFILE_UPLOAD_Image_EXCEPTION: IiKomidaErrorModel = {
    code: 'PVS025',
    message: 'Erro ao tentar carregar imagem para google storage!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_EMPTY_RESPONSE: IiKomidaErrorModel = {
    code: 'PVS026',
    message: 'Erro ao tentar obter access token para concluir a integração com pagseguro!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_EMPTY_APP: IiKomidaErrorModel = {
    code: 'PVS027',
    message: 'Ocorreu um erro interno e não podemos concluir a integração com pagseguro!'
  }
  static IKOMIDA_VENDOR_SERVICE_INTEGRATE_PAGSEGURO_EMPTY_CONFIG: IiKomidaErrorModel = {
    code: 'PVS028',
    message: 'Ocorreu um erro interno e não podemos concluir a integração com pagseguro!'
  }
  static IKOMIDA_VENDOR_SERVICE_NEW_STAFF_LIMIT_EXCEEDED: IiKomidaErrorModel = {
    code: 'PVS029',
    message: `O seu plano permite adição de até {0} colabores, e esse limite foi atingido.
        para adicionar mais colaboradores, por favor faça um upgrade do seu plano
        !`
  }

  //MARK: -- ADMIN microservice
  static IKOMIDA_ADMIN_SERVICE_NEW_PLAN_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PAS001',
    message: 'Está faltando dados do objeto do plano!'
  }
  static IKOMIDA_ADMIN_SERVICE_NEW_SETTING_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PAS002',
    message: 'Está faltando dados do objeto do configurações!'
  }
  static IKOMIDA_ADMIN_SERVICE_NEW_PLAN_EXCEPTION: IiKomidaErrorModel = {
    code: 'PRA003',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_GET_PLANS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS004',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_GET_SETTINGS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS005',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_NEW_SETTING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS006',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_DELETE_SETTING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS007',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_DELETE_PLAN_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS008',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_EDIT_SETTING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS009',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_ACTIVE_SETTING_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS010',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_PRODUCTS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS011',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_ORDERS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS012',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_RESELLERS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS013',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_USERS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS014',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_RESTAURANTS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS015',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_COUNT_COUPONS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS016',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_EDIT_PLAN_EXCEPTION: IiKomidaErrorModel = {
    code: 'PAS017',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_ADMIN_SERVICE_EDIT_PLAN_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PAS017',
    message: 'Está faltando dados do objeto do pano!'
  }
  static IKOMIDA_ADMIN_SERVICE_NEW_PLAN_DISCOUNT_TYPE: IiKomidaErrorModel = {
    code: 'PAS017',
    message: 'Tipo do disconto nao foi definido!'
  }

  //MARK: -- Reseller microservice
  static IKOMIDA_RESELLER_SERVICE_GET_RESELLER_INVALID_USER: IiKomidaErrorModel = {
    code: 'PRS001',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_GET_RESTAURANTS_INVALID_USER: IiKomidaErrorModel = {
    code: 'PRS002',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_INVALID_USER: IiKomidaErrorModel = {
    code: 'PRS003',
    message: 'O usuário não foi localizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_USED_USER: IiKomidaErrorModel = {
    code: 'PRS004',
    message: 'O vendedor já encontra-se cadastrado'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_CREATE_USER_DB_ERROR: IiKomidaErrorModel = {
    code: 'PRS005',
    message: 'Não foi possível criar o vendedor!'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_EXCEPTION: IiKomidaErrorModel = {
    code: 'PRS006',
    message: 'Ocorreu um erro inesperado, {0}!'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_MISSING_DATA: IiKomidaErrorModel = {
    code: 'PRS007',
    message: 'Está faltando dados do objeto do vendedor!'
  }
  static IKOMIDA_RESELLER_SERVICE_NEW_RESELLER_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PRS008',
    message: 'Usuário não autorizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_GET_RESTAURANTS_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PRS009',
    message: 'Usuário não autorizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_GET_RESELLERS_UNAUTHORIZED: IiKomidaErrorModel = {
    code: 'PRS010',
    message: 'Usuário não autorizado!'
  }
  static IKOMIDA_RESELLER_SERVICE_GET_RESELLER_EXCEPTION: IiKomidaErrorModel = {
    code: 'PRS011',
    message: 'Ocorreu um erro inesperado: {0}!'
  }
  static IKOMIDA_RESELLER_SERVICE_GET_RESTAURANTS_EXCEPTION: IiKomidaErrorModel = {
    code: 'PRS012',
    message: 'Ocorreu um erro inesperado: {0}!'
  }

  //GENRICS
  static IKOMIDA_OTIMATEL_SEND_ERROR: IiKomidaErrorModel = {
    code: 'POT001',
    message: 'Ocorreu um erro ao tentar enviar sms: {0}'
  }
  static IKOMIDA_OTIMATEL_SEND_EXCEPTION: IiKomidaErrorModel = {
    code: 'POT002',
    message: 'Um erro inespirado ocorreu ao tentar enviar sms: {0}'
  }

  //GENRICS
  static IKOMIDA_GENERIC_GATEWAY_ERROR: IiKomidaErrorModel = {
    code: 'GEN00001',
    message: '{0}'
  }

  //MAILJET
  static MAILJET_SEND_EMAIL_ERROR_RESPONSE: IiKomidaErrorModel = {
    code: 'MJT00001',
    message: 'ocorreu um erro ao tentar enviar email: {0}'
  }
  static MAILJET_SEND_EMAIL_EXCEPTION: IiKomidaErrorModel = {
    code: 'MJT00001',
    message: 'Um erro inespirado ocorreu ao tentar enviar email: {0}'
  }
}
