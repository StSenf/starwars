# Angular multi projects project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9 and Node version 20.10.0.

## About

This project contains two applications (`Star Wars Playground` and `Sling Academy`) and one library (`Shared Components`). The components of the library can be used in all projects.
The root project is a showcase for the shared component library.

## Running a project

Simply use a command

- `ng serve` (starts the showcase)
- `npm run start:starwars` (starts the star wars project)
- `npm run start:sling` (starts the sling academy project)

and open `http://localhost:4200/` in your browser.

## Development instructions

To start developing in either of the applications, you need to run them and optionally run the library in watch mode. To achieve this, run the following commands:

- `npm run watch:shared` (optional) and `ng serve`
- `npm run watch:shared` (optional) and `npm run start:starwars`
- `npm run watch:shared` (optional) and `npm run start:sling`
  
in two different Terminals

Open `http://localhost:4200/` in your browser. File changes will automatically trigger a page refresh.

## Running unit tests

To run unit tests of a specific project in a headless Chrome browser in watch mode, use the following commands:

- `npm run test:starwars` 
- `npm run test:sling`
- `npm run test:shared`

To run all unit tests use `npm run test:all`

## Code scaffolding

Run `ng g c COMPONENT_NAME --project PROJECT_NAME` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project PROJECT_NAME`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


## Missing e2e implementation

There is no e2e test setup provided for this project.
To use e2e tests, you need to first add a package that implements end-to-end testing capabilities.
Then you can run `ng e2e` to execute the end-to-end tests via the platform of your choice.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
