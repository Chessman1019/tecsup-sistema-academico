import { Component } from '@angular/core';
import { ConfiguracionJefatura } from '../../jefatura/configuracion/configuracion-jefatura';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [ConfiguracionJefatura],
  template: `<app-configuracion-jefatura></app-configuracion-jefatura>`
})
export class ConfiguracionAdmin {}