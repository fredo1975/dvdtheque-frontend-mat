import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmFilterSortComponent } from './film-filter-sort.component';

describe('FilmFilterSortComponent', () => {
  let component: FilmFilterSortComponent;
  let fixture: ComponentFixture<FilmFilterSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmFilterSortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmFilterSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
