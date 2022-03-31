import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'mercadopago', src: 'https://sdk.mercadopago.com/js/v2' }
];

