import { CritiquePresse } from './critique-presse';
import { Dvd } from './dvd';
import { DvdFormat } from './dvd-format';
import { Film } from './film';
import { Genre } from './genre';
import { Origine } from './origine';
import { Personne } from './personne';

const titre = 'spider-man';
const _annee = 2016;
const real = new Personne(1, 'wong kar', 'wyy', 'profile_path');
const real1 = [real,];
const act1 = new Personne(2, 'chung', 'fat', 'profile_path');
const act = [act1,];
const critiquesPresse = { id: 2, code: 1, newsSource: 'fat', author: 'profile_path', body: 'fake', rating: 5 } as CritiquePresse;
const critiquesPresseArr = [critiquesPresse,];
const genre = new Genre(1, 'comedy', 1);
const genreArray = [genre];
const posterPath = 'fake';
const dvd = new Dvd(2019, '1', '1', true, new Date(), new Date(), DvdFormat.DVD);
const alreadyInDvdtheque = false;
const tmdbId = 100;
const overview = 'overview';
const runtime = 120;
const homepage = 'homepage';
const dateSortie = new Date();
const dateInsertion = new Date();
const _origine: Origine = Origine.DVD;
describe('Film', () => {
  it('should create an instance', () => {
    // tslint:disable-next-line:max-line-length
    expect(new Film(1, titre, titre, _annee, dateSortie, dateInsertion, true, real1, act, critiquesPresseArr, genreArray, dvd, posterPath, alreadyInDvdtheque, tmdbId, overview, runtime, homepage, _origine,new Date(),new Date(),1)).toBeTruthy();
  });
});

it('Film should accept values in the constructor', () => {
  // tslint:disable-next-line:max-line-length
  const film = new Film(1, titre, titre, _annee, dateSortie, dateInsertion, true, real1, act, critiquesPresseArr, genreArray, dvd, posterPath, alreadyInDvdtheque, tmdbId, overview, runtime, homepage, _origine,new Date(),new Date(),1);
  expect(film.titre).toEqual(titre);
  expect(film.titreO).toEqual(titre);
  expect(film.dvd.ripped).toEqual(true);
  expect(film.realisateur[0].nom).toEqual(real.nom);
  expect(film.acteur[0].nom).toEqual(act1.nom);
  expect(film.alreadyInDvdtheque).toEqual(alreadyInDvdtheque);
});