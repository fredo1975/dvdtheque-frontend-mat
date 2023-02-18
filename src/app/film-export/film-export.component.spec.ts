import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmExportComponent } from './film-export.component';

describe('FilmExportComponent', () => {
  let component: FilmExportComponent;
  let fixture: ComponentFixture<FilmExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
