import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    
    // On vérifie si l'utilisateur est authentifié via notre service Pure JS
    if (!this.authService.getIsAuthenticated()) {
      // Si non, on déclenche le login
      this.authService.login(window.location.origin + state.url);
      return false;
    }

    return true;
  }
}