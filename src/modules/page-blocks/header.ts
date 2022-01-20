import {toggleclassListItem} from '../functions/function';
import RenderWinnersToPage from '../page-blocks/winners';
const navigation = document.querySelector('.navigation');
const wrapperCenter:HTMLDivElement = document.querySelector('.wrapper-center');
const wrapperLeft:HTMLDivElement = document.querySelector('.wrapper-left');
const btnCenter:HTMLLinkElement = document.querySelector('.js_garage');
const btnLeft:HTMLLinkElement = document.querySelector('.js_winners');
const winnersPage = new RenderWinnersToPage();

navigation.addEventListener('click', (e:Event) => {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if(target.classList.contains('js_garage')){
    visibleBlock(wrapperCenter, wrapperLeft)
    toggleclassListItem(btnCenter, btnLeft, "btn-active");
  } 
  if(target.classList.contains('js_winners')){
    visibleBlock(wrapperLeft, wrapperCenter)
    winnersPage.arrayCarsWinners = [];
    winnersPage.getWinnersCars({page:1, limit:10});
    winnersPage.getCountWinners();
    toggleclassListItem(btnLeft, btnCenter, "btn-active");
  } 
})

function visibleBlock(blockAddStyle:HTMLDivElement, blockRemoveStyle:HTMLDivElement) {
  toggleclassListItem(blockAddStyle, blockRemoveStyle, "wrapper-active");
  toggleclassListItem(blockRemoveStyle, blockAddStyle, "wrapper-hiden");
}