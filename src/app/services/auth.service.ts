import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // On initialise l'instance dès le début (ou via le constructeur)
  private keycloak: Keycloak | undefined;
  private authenticated: boolean = false;

  constructor() {}

  /**
   * Cette méthode sera appelée par votre factory (initializeKeycloak)
   * On lui passe la config récupérée dynamiquement.
   */
  async init(config: { url: string; realm: string; clientId: string }): Promise<boolean> {
    //console.log("Initialisation Keycloak en cours...");
    
    this.keycloak = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId
    });

    try {
      this.authenticated = await this.keycloak.init({ 
        onLoad: 'login-required',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: undefined
      });
      
      //console.log(this.authenticated ? "✅ Keycloak : Authentifié" : "ℹKeycloak : Non authentifié");
      return this.authenticated;
    } catch (error) {
      console.error(" Erreur lors de l'initialisation Keycloak", error);
      return false;
    }
  }

  login(redirectUri?: string) {
    return this.keycloak?.login({
      redirectUri: redirectUri || window.location.origin
    });
  }

  logout() {
    return this.keycloak?.logout({ 
      redirectUri: window.location.origin 
    });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  getIsAuthenticated(): boolean {
    // On vérifie à la fois notre variable et l'état réel de l'instance
    return this.authenticated && !!this.keycloak?.authenticated;
  }

  // Optionnel : Récupérer le nom de l'utilisateur
  getUsername(): string | undefined {
    return (this.keycloak?.tokenParsed as any)?.preferred_username;
  }
}