//
// ===== File app.globals.ts
//
'use strict';
//export var rest_server = 'http://95.59.26.76:8003/';
export var rest_server = 'http://localhost:8003/';

export var menuItemsOperator = [
  {label: 'Календарь', routerLink: ['/calendar']},
  {label: 'Инструкторы', routerLink: ['/instructors']},
  {label: 'Корты', routerLink: ['/courts']},
  {label: 'Выход', routerLink: ['/logout']},
];

export var menuItemsInstructor = [
  {label: 'Календарь', routerLink: ['/calendar_instructor']},
  {label: 'Выход', routerLink: ['/logout']},
];
export var menuItemsClient = [
  {label: 'Календарь', routerLink: ['/calendar']},
  {label: 'Выход', routerLink: ['/logout']},
];
