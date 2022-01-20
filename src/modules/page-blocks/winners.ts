import '../../styles/wrapper-left.scss';
import CreateResultListHTML from '../components/results-list';
import imgCar from '../components/image';
import CarsService from '../api/api';
import {ParametrsFetchUrl, ParametrCar, CreateWinnerCar} from '../interface/interface';

export default class RenderWinnersToPage {
  cars:CarsService;
  container:HTMLDivElement;
  order:string;
  page:number;
  limit:number;
  allCarsWinners:number;
  arrayCarsWinners:Array<ParametrCar>;
  toggle:boolean;
  constructor() {
    this.cars = new CarsService();
    this.toggle = true;
    this.page = 1;
    this.limit = 10;
    this.order = 'ASC';
    this.arrayCarsWinners = []
    this.allCarsWinners;
    this.container = document.querySelector('.place-root');
    this.getCountWinners()
    document.addEventListener('click', this.sortParametrsWinsCar.bind(this))
  }
 async getWinnersCars(prop?:ParametrsFetchUrl) {
   this.arrayCarsWinners = []
   try{
    this.container.innerHTML='';
    await this.cars.getWinnersCar(prop)
    .then(  response => {
     const ItemGarage = response.map( async item => {
        return[ await this.cars.getCarItemById('garage', item.id), item]
      });
      ItemGarage.forEach(item => {
       item.then(response => {
        const infoCaers1:ParametrCar = Object.assign( response[0]);
        const infoCaers2:CreateWinnerCar = Object.assign( response[1]);
        const allInfo:ParametrCar = {...infoCaers1, ...infoCaers2};
        this.arrayCarsWinners.push(allInfo)
        this.render(this.arrayCarsWinners);
       })
      })
    })
   }catch(e){
    // console.log(e)
   }
}
  sortCarResults(arr:Array<ParametrCar>, type?:string) {
    const newArr = arr.filter(item => item);
    const byField = (field:string) => {
      if(this.toggle) {
        this.toggle = false;
        return (a:ParametrCar, b:ParametrCar) => a[field] > b[field] ? 1 : -1;
      }
      this.toggle = true;
      return (a:ParametrCar, b:ParametrCar) => a[field] < b[field] ? 1 : -1;
    }
    return type ?  newArr.sort(byField(type)) : null;
  }
  render(arr:Array<ParametrCar>) {
    this.container.innerHTML = '';
    let index = 0;
    arr.map((item) => {
      index++
      const {id, name, color, wins, time} = item;
      const row = CreateResultListHTML(id, index, imgCar(color), name, wins, time);
    this.container.append(row);
    })
    
  }
  getCountWinners() {
    this.cars.getWinnersCar()
    .then(response => {
      const title = document.querySelector('.winner-title');
      this.allCarsWinners = response.length
      title.innerHTML= `Winner (${this.allCarsWinners})`;
    })
  }
  paginationsWinnersCars(type:string) {
    if(type === 'prev' && this.page > 1){
      this.page--;
      this.getWinnersCars({page:this.page, limit:this.limit})
    }
    if(type === 'next' && this.page < Math.ceil(this.allCarsWinners/this.limit)) {
      this.page++;
      this.getWinnersCars({page:this.page, limit:this.limit})
    }
    const pageNumber = document.querySelector('.winner-page');
    pageNumber.innerHTML = `Page # ${this.page}`;
  }
  sortParametrsWinsCar( e:Event) {
    const target = e.target as HTMLElement;
    const type:string = target.dataset.type;
    switch(type) {
      case 'sort-time': {
        const sortArr = this.sortCarResults(this.arrayCarsWinners, 'time');
        this.render(sortArr);
        break
      }
      case 'sort-wins': {
        const sortArr = this.sortCarResults(this.arrayCarsWinners, 'wins');
        this.render(sortArr);
        break
      }
      case 'sort-name': {
        const sortArr = this.sortCarResults(this.arrayCarsWinners, 'name');
        this.render(sortArr);
        break
      }
      case 'prev': {
        this.paginationsWinnersCars('prev')
        break
      }
      case 'next': {
        this.paginationsWinnersCars('next')
        break
      }
    }
  }
}