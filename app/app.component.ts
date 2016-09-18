import {Component} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    getToken() {
        return localStorage.getItem('id_token');
    }
}
