export interface IEmail {
  subject: string
  body: string
}
export default class Email {
  subject: string
  body: string

  constructor(object: IEmail, ...args: any[]) {
    this.subject = object.subject
    this.body = object.body
    if ((args?.length ?? 0) > 0) {
      this.body =
        this.body?.replace(/{(\d+)}/g, (match: string, index: number) =>
          args?.[index] ? String(args[index]) : match
        ) ?? this.body
    }
  }

  static VENDOR_REGISTRATION_SUCCESSFULL: IEmail = {
    subject: 'Cadastro bem sucedido!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />Seu cadastro foi concluído com sucesso.<br />Agora você pode usufruir das funcionalidades da nossa plataforma.<br />Segue os dados da sua conta:<ul><li>Link para download do iKomida dashboard: {2}</li><li>ID do do seu estabelecimento: {3}</li><li>Seu login: {4}</li><li>Sua senha: é a mesma que você colocou na hora de contratação do serviço.</li></ul><br /><br />Estamos muito felizes em tê-lo conosco.<br /><br />Qualquer dúvida entre em contato conosco.<br />Atenciosamente<br />Equipe do <b><a href="{6}">{5}</a></b></p></div>`
  }

  static RESELLER_REGISTRATION_SUCCESSFULL: IEmail = {
    subject: 'Cadastro bem sucedido!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />Você foi escolhido para participar no nosso programa autônomo de vendas, se você for adicionado de uma forma iligal ou sem sua autorização, entre em contato com a gente.<br />Agora você pode ajudar no crescimento da nossa plataforma ganhando dinheiro junto com a gente como um vendedor autônomo, com isso você vende quando quiser, onde e como quiser sem compromisso com a gente, você receberá o que você vende.<br />Segue os dados da sua conta:<ul><li><a href="{2}">Link para download do app</a></li><li>Seu login: {3}</li><li>Sua senha: {4}<br />Essa é uma senha gerada aleatoriamente, troca ela assim que logar no app, e se tiver algum problema entre em contato com a nossa equipe.</li></ul><br /><br />Estamos muito felizes em tê-lo conosco.<br /><br />Atenciosamente<br />Equipe do <b><a href="{6}">{5}</a></b></p></div>`
  }

  static STAFF_REGISTRATION_SUCCESSFULL: IEmail = {
    subject: 'Cadastro bem sucedido!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />Você foi adicionado para ser um colaborador no estabelecimento {2}, se você for adicionado de uma forma iligal ou sem sua autorização, entre em contato com a gente.<br />Agora você pode ajudar a cuidar do estabelecimento {2} através do app iKomida dashboard.<br />Segue os dados da sua conta:<ul><li><a href="{3}">Link para download do app</a></li><li>Seu login: {4}</li><li>Sua senha: {5}<br />Essa é uma senha gerada aleatoriamente, troca ela assim que logar no app, e se tiver algum problema entre em contato com a nossa equipe.</li></ul><br /><br />Estamos muito felizes em tê-lo conosco.<br /><br />Atenciosamente<br />Equipe do <b><a href="{7}">{6}</a></b></p></div>`
  }
  static CLIENT_REGISTRATION_SUCCESSFULL: IEmail = {
    subject: 'Cadastro bem sucedido!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />Seu cadastro foi concluído com sucesso.<br />Agora você pode usufruir das funcionalidades do nosso app.<br /><br />Estamos muito felizes em tê-lo conosco.<br /><br />Qualquer dúvida entre em contato conosco.<br />Atenciosamente<br />Equipe do <b>{2}</b></p><small><a href="{3}">{4}</a></small></div>`
  }
  static CLIENT_PASSWORD_REQUESTED_SUCCESSFULL: IEmail = {
    subject: 'Senha nova senha foi gerada com sucesso!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />Sua senha foi atualizada com sucesso.<br />Segue a sua nova senha: {2}<br />Agora acesse sua conta usando essa senha e vá até seu perfil e troca ela.<br /><br />Qualquer dúvida entre em contato conosco.<br /><br />Atenciosamente<br />Equipe do <b>{3}</b></p></div>`
  }
  static CLIENT_PASSWORD_UPDATED_SUCCESSFULL: IEmail = {
    subject: 'Senha atualizada com sucesso!',
    body: `<div><h1>{0}</h1><p>Olá <b>{1}</b>,<br /><br />A senha da sua conta foi atualizada com sucesso.<br />Se não for você, por favor nos comunique.<br /><br />E qualquer dúvida entre em contato conosco.<br /><br />Atenciosamente<br />Equipe do <b>{2}</b></p></div>`
  }
}
