import CreatePlaceBlockHTML from '../components/move-block';
import imgCar from '../components/image';
import CarsService from '../api/api';
import {ParametrCar, CreateCar, LocalParametrs} from '../interface/interface';
import {makeRandomColor} from '../functions/function';
import {modelsCar} from '../components/models';
import CreateResultCarHTML from '../components/results-race'

class  RenderCarsToPage {
  cars:CarsService;
  container: HTMLElement;
  countCarToServer: number;
  pageCount:HTMLParagraphElement;
  paginationBtn:Element;
  totalCars:Element;
  pageNumber:number;
  maxCountCarToPage:number;

  constructor(container:HTMLElement) {
    this.cars = new CarsService;
    this.container = container;
    this.countCarToServer = 0;
    this.pageNumber = 1;
    this.maxCountCarToPage = 6;
    this.pageCount= document.querySelector('.count-page');
    this.paginationBtn = document.querySelector('.pagination-btn');
    this.totalCars = document.querySelector('.garage-count');

    this.paginationBtn.addEventListener('click', this.changePageNumber.bind(this))
    this.getCountCarsToServer();
  }
  removeAttributeDisabled(arr:NodeListOf<HTMLElement>|HTMLElement[]) {
    arr.forEach(item => item.removeAttribute('disabled'));
  }
  addAttributeDisabled(arr:NodeListOf<HTMLElement>|HTMLElement[]) {
    arr.forEach(item => item.setAttribute('disabled', 'true'));
  }
  getCountCarsToServer() {
    this.cars.getResource('garage', {})
    .then(response => {
      this.countCarToServer = response.length
      this.totalCars.innerHTML = `Garage <span>(${this.countCarToServer})</span>`;
    });
  }
  renderCarsToPage(arr:Array<ParametrCar>) {
    this.container.innerHTML = '';
    arr.forEach(item => {
      const {name, color, id} = item;
      const img = imgCar(color);
      const newCar = CreatePlaceBlockHTML(img, name, id);
      this.container.append(newCar);
    });
  }
  paginationPage(limit?:number) {
    this.cars.getResource('garage', {
      page: this.pageNumber,
      limit: limit ? limit : 6
    })
    .then(response => {
      this.pageCount.innerHTML =` Page <span>(${this.pageNumber})</span>`;
      this.renderCarsToPage(response);
    })
  }
  changePageNumber(e:Event) {
    const targrt = e.target as HTMLButtonElement;
    if(targrt.textContent === 'Prev' && this.pageNumber > 1){
      this.pageNumber--;
      this.paginationPage(this.maxCountCarToPage)
    }
    if(targrt.textContent === 'Next' && this.pageNumber <= this.countCarToServer/this.maxCountCarToPage){
      this.pageNumber++;
      this.paginationPage(this.maxCountCarToPage)
    }
  }
  
}

class AnimationCar extends RenderCarsToPage {
  timeCar:Date
  timeResults:Array<number[]>
  resultList:HTMLUListElement
  buttonsDrive:Array<HTMLButtonElement>
  buttonsStop:Array<HTMLButtonElement>|NodeListOf<HTMLButtonElement>
  resultRaceForStorege:LocalParametrs
  secondAccse:boolean
  constructor(){
    super(carRaceContainer);
    this.resultList = document.querySelector('.results-race-list');
    this.timeCar;
    this.secondAccse = true
    this.timeResults = [];
    this.resultRaceForStorege;
    this.buttonsDrive = Array.from(document.querySelectorAll('[data-type="drive"]'));
    this.buttonsStop = Array.from(document.querySelectorAll('[data-type="stop"]'));
  }
  startRaceAll() {
    this.buttonsDrive  = Array.from(document.querySelectorAll('[data-type="drive"]'));
    this.buttonsStop  = document.querySelectorAll('[data-type="stop"]');
    shuffle(this.buttonsDrive);
    this.removeAttributeDisabled(this.buttonsStop)
    this.addAttributeDisabled(this.buttonsDrive )
   
    this.buttonsDrive.forEach( item => {
      const id = Number(item.dataset.id);
      this.startAnimation(id, item)
    })
    function shuffle(array:Array<HTMLElement>) {array.sort(() => Math.random() - 0.5);}
  }
 
  reset() {
    this.removeAttributeDisabled(this.buttonsDrive)
    this.addAttributeDisabled(this.buttonsStop)
    const moveBlock:NodeListOf<HTMLElement> = document.querySelectorAll('.js_car_block');
    moveBlock.forEach(item => {
      const id = Number(item.dataset.block);
      this.stopAnimation(id, item)
      this.resultList.innerHTML = '';
      this.timeResults = [];
    });
  }

  startAnimation(id:number, element:HTMLElement) {
    const widthCar = Math.floor(document.querySelector('.js_car_block')
        .getBoundingClientRect().width);
    const widthContainer = Math.floor(document.querySelector('.move-block')
        .getBoundingClientRect().width);
    const currentCar:HTMLDivElement = document.querySelector(`[data-block="${id}"]`)
    const widthParametr = widthContainer > 1050 ? 3 : 2;
    const distance = Math.floor(widthContainer - (widthCar * widthParametr));
    const timeCar = new Date();
    let flag = true;
    let translate = 2;
    let acceleration = 1;

    this.cars.controlsEngineCar(id, 'started')
    .then(response => acceleration = response.velocity / 15);
    this.cars.controlsEngineCar(id, 'drive')
    .then(response => response === 500 ? flag = false : flag);
     
    const step =  () => {
      if(flag){
        if(translate < distance) {
         window.requestAnimationFrame(step);
          translate += acceleration;
          currentCar.style.transform = `translateX(${translate}px)`;
        }else {
          this.removeAttributeDisabled([element])
          this.addAttributeDisabled([ document.querySelector(`[data-id="${id}"] [data-type="stop"]`)])
          const now = new Date();
          const time = +now - +timeCar;
          const currentTimeCar = [id, time];
          this.timeResults.push(currentTimeCar);
          this.renderResultsPageRace(this.timeResults, id);
         return this.timeResults
        } 
      }
    }
    step()
  }
  renderResultsPageRace(arr:Array<number[]>, id:number) {
    this.resultList.innerHTML = '';
    arr.forEach((item)=>{
      const title:HTMLParagraphElement = document.querySelector(`[data-id="${item[0]}"] .name-care-title`);
      const name = title.dataset.name;
      const time = item[1]/1000
      this.resultList.append(CreateResultCarHTML(name, time))
      if(this.timeResults[0][0] === id){
        this.setLocalStorege(this.timeResults[0][0], this.timeResults[0][1])
      }
    })
  }
  setLocalStorege(id:number, time:number) {
    const winner:LocalParametrs = JSON.parse(localStorage.getItem('winnerInfo'));
    if(winner && Object.prototype.hasOwnProperty.call(winner, id))  {
      const winers = winner[id][0] + 1;
      const timeResults:number = winner[id][1] > time ? time : winner[id][1];
      this.resultRaceForStorege = {
        ...winner,
        [id]: [winers, timeResults]
      }
      const data = {
        wins: winers,
        time:timeResults
      }
      this.cars.updateWinnerCarItem(id, data)
      localStorage.setItem('winnerInfo', JSON.stringify(this.resultRaceForStorege))
      return
    }
    const winnerInfo:LocalParametrs = {
      ...winner,
      [id]: [1, time ]
    }
    localStorage.setItem('winnerInfo', JSON.stringify(winnerInfo));
    this.createWinnerCar(id, time, 1);
  }

  createWinnerCar(id:number, time:number, wins:number) {
    const winnerInfo = {id, wins, time }
    this.cars.createCarItem('winners', winnerInfo);
  }
  stopAnimation(id:number, elem:HTMLElement) {
      this.cars.controlsEngineCar(id,'stopped');
      elem.style.transform = 'translateX(0px)';
  }
}
export default class GaragePage extends AnimationCar{
  inputNameCreate:HTMLInputElement;
  inputColorCreate:HTMLInputElement;
  buttonAddCreteCar:HTMLButtonElement;
  controlPanelCreate:NodeListOf<HTMLInputElement>;
  controlPanelUpdata:NodeListOf<HTMLElement>;
  idCar:number;

  constructor() {
    super();
    this.controlPanelCreate = document.querySelectorAll('#input_name, #input_color');
    this.controlPanelUpdata = document.querySelectorAll('#input_rename, #input_recolor, #car_updata');
    this.idCar = NaN;
    document.addEventListener('click', this.setListenersAndFunctions.bind(this), true);
  }
  
  createCarPage(param:CreateCar):boolean {
    if(param.name){
      this.cars.createCarItem('garage', param);
      this.getCountCarsToServer();
      this.paginationPage(this.maxCountCarToPage);
      this.controlPanelCreate[0].value = '';
      return false
    } 
    this.controlPanelCreate[0].placeholder = 'Input name';
  }
 
  getValue(elements:NodeListOf<Element>) {
    const name:HTMLInputElement =  elements[0] as HTMLInputElement;
    const color:HTMLInputElement =  elements[1] as HTMLInputElement;
   return {
      name: name.value,
      color: color.value
    }
  }
  changeCarPage(id:number, param:CreateCar) {
    this.cars.updateCarItem('garage', id, param);
    this.paginationPage(this.maxCountCarToPage);
    this.addAttributeDisabled(this.controlPanelUpdata)
  }
  deleteCarPage(id:number) {
    const placeRaceAll = document.querySelectorAll(`[data-id="${id}"]`);
    placeRaceAll.forEach(item => item.remove());
    this.cars.deleteCarItem('garage', id);
    this.getCountCarsToServer();
    this.paginationPage(this.maxCountCarToPage);
    this.cars.deleteWinnerCarItem(id);
  }
  createRandomCars() {
    let i = 0;
    while(i <= 100){
      i++;
      const index = Math.floor(Math.random()* (1206 - 0))
      const name:string = modelsCar[index]
      const param = {
        name: name,
        color: makeRandomColor()
      }
      this.cars.createCarItem('garage', param);
      this.getCountCarsToServer();
      this.paginationPage(this.maxCountCarToPage);
    }
  }
  setListenersAndFunctions(e:Event) {
    const target = e.target as HTMLElement;
    const type:string = target.dataset.type;
    switch(type) {
      case 'select': {
        this.idCar = Number(target.dataset.id);
        this.removeAttributeDisabled(this.controlPanelUpdata);
        break
      }
      case 'remove': {
        this.idCar = Number(target.dataset.id);
        this.addAttributeDisabled([target]);
        this.deleteCarPage(this.idCar);
        break
    }
      case 'drive': {
        this.addAttributeDisabled([target]);
        this.idCar = Number(target.dataset.id);
        this.removeAttributeDisabled([document.querySelector(`[data-id="${this.idCar}"] [data-type="stop"]`)]);
        this.startAnimation(this.idCar, target);
        break
      }
      case 'stop': {
        this.idCar = Number(target.dataset.id);
        const moveCarBlock:HTMLElement = document.querySelector(`[data-block="${this.idCar}"]`);
        this.removeAttributeDisabled([document.querySelector(`[data-id="${this.idCar}"] .btn-move`)])
        this.addAttributeDisabled([target]);
        this.stopAnimation(this.idCar, moveCarBlock);
        break
      }
      case 'race': {
        this.removeAttributeDisabled([document.querySelector('[data-type="reset"]')])
        this.addAttributeDisabled([target]);
        this.startRaceAll();
        break
      }
      case 'update': {
        const parmUpdate = this.getValue(this.controlPanelUpdata);
        this.changeCarPage(this.idCar, parmUpdate);
        break
      }
      case 'reset': {
        this.removeAttributeDisabled([document.querySelector('[data-type="race"]')])
        this.addAttributeDisabled([target]);
        this.reset();
      break
     }
      case 'create': {
        const parmCreate = this.getValue(this.controlPanelCreate);
        this.createCarPage(parmCreate);
      break
    }
      case 'create-One-Hundred': {
       this.createRandomCars();
      break
    } 
    }
  }
}

const carRaceContainer:HTMLElement = document.querySelector('.race-block');

