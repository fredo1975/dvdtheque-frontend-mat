import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing/routing.module';
import { FilmListComponent } from './film-list/film-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { ConfigInitService } from './init/config-init.service';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { GenresPipe } from './pipes/genres.pipe';
import { RealisateursPipe } from './pipes/realisateurs.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
@NgModule({
  declarations: [
    AppComponent,
    FilmListComponent,
    NavbarComponent,
    FilmDetailComponent,
    GenresPipe,
    RealisateursPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    MatToolbarModule,
    MatButtonModule,
    KeycloakAngularModule,
    HttpClientModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService, ConfigInitService],
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
