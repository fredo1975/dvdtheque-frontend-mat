import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FilmListComponent } from '../film-list/film-list.component';
import { AuthGuard } from '../guard/auth.guard';
import { FilmDetailComponent } from '../film-detail/film-detail.component';
import { FilmAddComponent } from '../film-add/film-add.component';
import { FilmExportComponent } from '../film-export/film-export.component';


const routes: Routes = [
  { path: '', redirectTo: '/filmList', pathMatch: 'full' },
  { path: 'filmList', component: FilmListComponent, canActivate: [AuthGuard]},
  { path: 'filmDetail/:id', component: FilmDetailComponent, canActivate: [AuthGuard] },
  { path: 'filmAdd', component: FilmAddComponent, canActivate: [AuthGuard] },
  { path: 'filmExport', component: FilmExportComponent, canActivate: [AuthGuard] },
  /*
  { path: 'filmSearchDisplay', component: FilmSearchDisplayComponent, canActivate: [AuthGuard] },
  
  { path: 'filmAdd', component: FilmAddComponent, canActivate: [AuthGuard] },
  { path: 'filmExport', component: FilmExportComponent, canActivate: [AuthGuard] },
  { path: 'filmImport', component: FilmImportComponent, canActivate: [AuthGuard] },
  { path: 'filmAdmin', component: FilmAdminComponent, canActivate: [AuthGuard] },
  { path: 'filmUpdateCritiquepresse/:id', component: FilmUpdateCritiquepresseComponent, canActivate: [AuthGuard] }*/
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutingModule { }
