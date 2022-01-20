import CarsService from '../api/api';
import '../page-blocks/header';
import GaragePage from '../page-blocks/garage';
import '../page-blocks/winners';
import RenderWinnersToPage from '../page-blocks/winners';

document.addEventListener("DOMContentLoaded", () => {
  const URL_GARAGE = 'garage'
  const carRaceContainer:HTMLElement = document.querySelector('.race-block');
  const carNumberInput:HTMLInputElement = document.querySelector('#count-car');
  const garage = new GaragePage();
  garage.maxCountCarToPage = Number(carNumberInput.value);
  garage.paginationPage(Number(carNumberInput.value));

  carNumberInput.addEventListener('change', () => {
    garage.maxCountCarToPage = Number(carNumberInput.value);
    garage.paginationPage(Number(carNumberInput.value));
  })

  // const winnersPage = new RenderWinnersToPage();
});
