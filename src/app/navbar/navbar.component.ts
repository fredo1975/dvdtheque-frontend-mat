import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor(private router: Router, private keycloakService: KeycloakService) { }
  @Output() public sidenavToggle = new EventEmitter();
  ngOnInit() {
  }

  logout(){
    this.keycloakService.logout();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
    //console.log('onToggleSidenav');
  }
}
