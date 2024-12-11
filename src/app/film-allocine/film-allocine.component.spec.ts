import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmAllocineComponent } from './film-allocine.component';

describe('FilmAllocineComponent', () => {
  let component: FilmAllocineComponent;
  let fixture: ComponentFixture<FilmAllocineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilmAllocineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmAllocineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
