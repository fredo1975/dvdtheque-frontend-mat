# AGENTS.md — Directives pour les agents IA

Ce fichier contient les directives et conventions à respecter pour travailler sur ce projet : **dvdtheque-frontend-mat**.

## Vue d'ensemble du projet

Application front-end Angular d'une "dvdthèque" (gestion de collection de films). L'interface affiche, filtre, trie et gère des films (ajout, modification, suppression, import/export), avec des données enrichies provenant d'Allociné et de TMDB.

- Langage principal : TypeScript (strict)
- Framework : Angular 19 (composants **standalone**)
- UI : Angular Material (thème `deeppurple-amber`)
- Gestion d'état : **Angular Signals** (`signal`, `computed`, `effect`) via des stores (ex. `src/app/store/film.store.ts`)
- Auth : Keycloak (`keycloak-js`), via `AuthService` + intercepteur HTTP
- Temps réel : RxStomp (WebSocket) via `src/app/init/rx-stomp.service.ts`
- Tests : Jasmine + Karma
- CI : Jenkins (`Jenkinsfile`), déploiement via `Dockerfile` + `nginx.conf`

## Commandes utiles

| Commande | Usage |
| --- | --- |
| `npm start` | Serveur de dev local (`ng serve --proxy-config src/proxy.conf.local.json -c local`) |
| `npm run build` | Build de production (`ng build`) |
| `npm test` | Tests unitaires (Karma, navigateur Chrome headless) |
| `ng generate component nom` | Générer un composant via Angular CLI |

Il n'y a pas de script de lint configuré. La vérification de base avant livraison est `npm run build` (vérifie le typage strict et les `strictTemplates`) et `npm test`.

## Structure du projet

- `src/app/` — code applicatif
  - `components/` — composants par feature (ex. `film-list/`, `film-admin/`, `film-export/`, `film-import/`, `film-allocine/`, `navbar/`, `film-filter-sort/`...)
  - `model/` — interfaces/modèles métier (ex. `film.ts`, `fiche-film.ts`, `genre.ts`, `origine.ts`...)
  - `services/` — services HTTP et de domaine (ex. `api.service.ts`, `film.service.ts`, `auth.service.ts`)
  - `store/` — stores à base de Signals (ex. `film.store.ts`)
  - `pipes/` — pipes Angular custom (ex. `acteurs.pipe.ts`, `genres.pipe.ts`, `realisateurs.pipe.ts`)
  - `interceptors/` — intercepteurs HTTP (`auth.interceptor.ts`)
  - `guard/` — route guards (`auth.guard.ts`)
  - `init/` — initialisation applicative (Keycloak, RxStomp, config runtime)
  - `routing/` — configuration des routes (`routing.module.ts`)
- `src/environments/` — environments `local`, `dev`, `prod`
- `src/assets/config/` — configs runtime (`config.local.json`, `config.dev.json`, `config.prod.json`)

## Conventions à respecter

### Style de code

- Indentation : **2 espaces**, utf-8, newline finale (cf. `.editorconfig`)
- TypeScript : **guillemets simples** (`'`)
- TypeScript en mode **strict** ; le typage explicite est obligatoire (types de retour des méthodes publiées, interfaces pour les modèles, `Observable<T>` pour les appels HTTP)
- Les **commentaires dans le code sont en français** (ex. `// On combine les paramètres dans un computed...`). Suivre cette convention : commentaires en français uniquement si nécessaires, brefs.

### Angular

- **Composants standalone** : utiliser `imports: [...]` directement sur le décorateur `@Component`, pas de `NgModule` supplémentaire.
- Préfixe des sélecteurs : `app-`
- Noms de fichiers Angular CLI : `nom-composant.component.{ts,html,css,spec.ts}`
- **Injection de dépendances** : privilégier `inject()` (ex. `store = inject(FilmStore)`).
- **Gestion d'état**: stocker l'état dans des stores à base de Signals ; les composants lisent les signaux (ex. `films = this.store.films`) et appellent les méthodes du store. Éviter de dupliquer l'état local dans les composants.
- Les templates et styles sont dans des fichiers séparés (`templateUrl`, `styleUrls`).

### Données et API

- Toutes les appels HTTP passent par `ApiService` (relativement au proxy, ex. `/dvdtheque-service`, `/dvdtheque-allocine-service`). Les couches métier passent par `FilmService`, les composants/stores consomment `FilmService`.
- Les flux HTTP retournent des `Observable` RxJS (utiliser `rxjs/operators`: `switchMap`, `catchError`, `tap`, `map`...).
- La config runtime (URLs Keycloak, adresses backends) est chargée depuis les fichiers `src/assets/config/config.*.json` au boot, pas codée en dur dans les services.
- La pagination `/films/paginatedSarch` attend `query`, `offset`, `limit`, `sort` (pagination 1-based dans le store `film.store.ts`).

### Environments / déploiement

- Il existe 3 configurations de build : `local`, `dev`, `production` (définies dans `angular.json`).
- Les URLs d'API varient selon l'environment (`src/environments/environment.*.ts`). Ne pas modifier `environment.ts` directement pour une config spécifique.
- Budgets de build : `initial` (warning 1mb, error 2mb) et `anyComponentStyle` (warning 2kb, error 4kb) en production — ne pas ajouter de gros poids (images, librairies) dans les styles de composants sans justification.

### Tests

- Chaque service, pipe, guard et composant a un fichier `.spec.ts` co-localisé (Jasmine/Karma).
- Ajouter ou maintenir les tests pour toute nouvelle fonctionnalité.
- Lancer `npm test` pour vérifier.

### Convention Git

- Messages de commit en **anglais**, style direct et court (ex. "fix the refresh of the film list", "first commit for upgrade to 19").

## Règles de travail pour les agents IA

1. **Lire avant de modifier** : examiner le fichier cible et ses voisins pour suivre les conventions existantes.
2. **Ne jamés casser le typage strict** : après chaque modification, lancer `npm run build` pour valider TypeScript et templates.
3. **Utiliser l'existant** : pour toute UI, réutiliser les composants Angular Material déjà présents (pas d'introduire de nouvelle bibliothèque UI). Pour toute librairie externe, vérifier au préalable dans `package.json` quelle existe déjà.
4. **Pas de MVP : livrer du code de production** — typé explicitement, sans valeurs de debug `console.log` laissées (sauf déjà présentes), sans commentaires superflus.
5. **Ne pas coder en dur des secrets / URLs** : tout passe par les environments, la config runtime ou les proxys.
6. **Adapter la langue** : commentaires en français (si nécessaires), messages de commit en anglais, code et identifiants en anglais.
7. **Ne pas commiter** sans demande explicite de l'utilisateur.
8. **Fichiers clés à consulter en premier** : `package.json`, `angular.json`, `tsconfig.json`, `src/main.ts`, `src/app/routing/routing.module.ts`.