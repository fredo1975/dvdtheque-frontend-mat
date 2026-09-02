import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatIconButton, MatAnchor } from '@angular/material/button';
import { MatToolbar, MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [MatToolbarModule, MatToolbarRow, MatIconButton, MatIconModule, MatAnchor, RouterLink, MatSidenavContainer, MatSidenav, MatNavList, MatListItem, MatSidenavContent, RouterOutlet]
})
export class NavbarComponent implements OnInit{
  constructor(private router: Router, private authService: AuthService) { }
  @Output() public sidenavToggle = new EventEmitter();
  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
    //console.log('onToggleSidenav');
  }
}
