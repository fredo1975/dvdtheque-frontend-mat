import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmAdminComponent } from './film-admin.component';

describe('FilmAdminComponent', () => {
  let component: FilmAdminComponent;
  let fixture: ComponentFixture<FilmAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
