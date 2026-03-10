import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // On utilise 'from' pour transformer la promesse de rafraîchissement en flux (Observable)
    return from(this.authService.getValidToken()).pipe(
      switchMap(token => {
        // Si on a un jeton (neuf ou rafraîchi), on l'ajoute à la requête
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        // On laisse la requête continuer son chemin vers le Pi
        return next.handle(request);
      })
    );
  }
}