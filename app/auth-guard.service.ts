import {Injectable}     from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot}    from '@angular/router';
import {AuthService} from "./login/auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    let roles = route.data["roles"] as Array<string>;
    console.log('roles:' + roles);

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) {
      if (this.authService.Role == 'instructor') {
        this.authService.redirectUrl = 'calendar_instructor';
      }
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }
}
