import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmUpdateCritiquepresseComponent } from './film-update-critiquepresse.component';

describe('FilmUpdateCritiquepresseComponent', () => {
  let component: FilmUpdateCritiquepresseComponent;
  let fixture: ComponentFixture<FilmUpdateCritiquepresseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FilmUpdateCritiquepresseComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(FilmUpdateCritiquepresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
