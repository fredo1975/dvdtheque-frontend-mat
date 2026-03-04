import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConfigInitService } from './config-init.service';
import Keycloak from 'keycloak-js';
import { AuthService } from '../services/auth.service';

// On ne l'instancie pas ici car on n'a pas encore le JSON
export let keycloak: Keycloak; 

export function initializeKeycloak(
  configService: ConfigInitService,
  authService: AuthService // Injectez votre nouveau service ici
) {
  return () =>
    configService.getConfig().pipe(
      switchMap((config) => {
        if (!config) return of(false);
        
        // On appelle le init du service avec la config du JSON
        return from(authService.init({
          url: config['KEYCLOAK_URL'],
          realm: config['KEYCLOAK_REALM'],
          clientId: config['KEYCLOAK_CLIENT_ID']
        }));
      }),
      catchError(() => of(false))
    );
}