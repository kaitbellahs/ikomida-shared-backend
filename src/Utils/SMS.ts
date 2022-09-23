export default class SMS {
  message: string;

  constructor(message: string, ...args: any[]) {
    this.message = message;
    if ((args?.length ?? 0) > 0) {
      this.message =
        this.message?.replace(/{(\d+)}/g, (match: string, index: number) =>
          args?.[index] ? String(args[index]) : match,
        ) ?? this.message;
    }
  }

  static VALIDATION_CODE = `{0} é o seu código de validação\n {1}.`;
}
