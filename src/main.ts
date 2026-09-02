import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RoutingModule } from './app/routing/routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { AuthService } from './app/services/auth.service';
import { ConfigInitService } from './app/init/config-init.service';
import { initializeKeycloak } from './app/init/keycloak-init.factory';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { initializeRxStompService } from './app/init/rx-stomp-init.factory';
import { RxStompService } from './app/init/rx-stomp.service';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, RoutingModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, ReactiveFormsModule, FormsModule, MatGridListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatListModule, MatCheckboxModule, MatProgressBarModule),
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        // 1. Dépendance pour RxStomp (déjà présente chez vous)
        {
            provide: RxStompService,
            useFactory: initializeRxStompService,
        },
        // 2. Initialisation de Keycloak
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [ConfigInitService, AuthService] // Très important : injecter les services requis
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));