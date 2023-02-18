import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmImportComponent } from './film-import.component';

describe('FilmImportComponent', () => {
  let component: FilmImportComponent;
  let fixture: ComponentFixture<FilmImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
