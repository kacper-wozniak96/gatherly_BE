import { Type } from '@nestjs/common';

export class Provider {
  provide: symbol;
  useClass: Type;

  constructor(provide: symbol, useClass: Type) {
    this.provide = provide;
    this.useClass = useClass;
  }
}
