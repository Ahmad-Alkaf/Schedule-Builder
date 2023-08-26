# Schedule Builder

Design and edit schedules without worrying about collisions between rooms or teachers. Also, you can build a schedule from scratch by generating lectures automatically you just have to provide the essential information such as how many hours in a week a subject needs to be lectured. However, you can add a subject in a pre-built schedule so that the lectures generator can place your lectures in collision-free places.

Initially, we often need to change a lecture place from time to time, (teachers or students don't like their schedule... etc.). In this case, you don't need more than dragging and dropping this lecture, and if there is another schedule that has a lecture with the same teacher or room in the dropped place you will face a collision detection red flash. that will tell you all collision information without any words using only interactive UI design. Red flashy (schedule name, teacher name, room name, ... etc.) that indicates a collision.

This project is made as a project for [Human-Computer Interaction (HCI)](https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction) subject at [Al-Ahgaff University](http://ahgaff.edu).

You can run the project easily in a development server following the Angular instructions below. 

NOTE: Clone or Download the code of the [localStorage-NoBackend](https://github.com/Ahmad-Alkaf/schedule_maker/tree/localStorage-NoBackend) branch because it can run without any server configuration and it will save schedules' information in the browser's local storage instead of the main branch which was built with backend server capability to store data in a Database. Which is not needed for such a program. But as you know university stuff...

<br/>
<br/>
<br/>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
