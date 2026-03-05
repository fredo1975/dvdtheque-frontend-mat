import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
