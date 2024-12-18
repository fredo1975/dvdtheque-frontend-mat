import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing/routing.module';
import { FilmListComponent } from './film-list/film-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
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
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { FilmAddComponent } from './film-add/film-add.component';
import { FilmFilterSortComponent } from './film-filter-sort/film-filter-sort.component';
import { FilmExportComponent } from './film-export/film-export.component';
import { FilmImportComponent } from './film-import/film-import.component';
import { RxStompService } from './init/rx-stomp.service';
import { initializeRxStompService } from './init/rx-stomp-init.factory';
import { FilmAdminComponent } from './film-admin/film-admin.component';
import { FilmUpdateCritiquepresseComponent } from './film-update-critiquepresse/film-update-critiquepresse.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { FilmAllocineComponent } from './film-allocine/film-allocine.component';
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);
@NgModule({
  declarations: [
    AppComponent,
    FilmListComponent,
    NavbarComponent,
    FilmDetailComponent,
    GenresPipe,
    RealisateursPipe,
    FilmAddComponent,
    FilmFilterSortComponent,
    FilmExportComponent,
    FilmImportComponent,
    FilmAdminComponent,
    FilmUpdateCritiquepresseComponent,
    FilmAllocineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
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
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FlexLayoutModule,
    MatListModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService, ConfigInitService],
  },
  { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  {
    provide: RxStompService,
    useFactory: initializeRxStompService,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
