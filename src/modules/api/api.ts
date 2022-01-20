import {CreateCar, ParametrsFetchUrl, CreateWinnerCar, ParametrCar } from '../interface/interface';

class GetResurceCar  {
  url:string;
  constructor() {
    this.url = 'http://127.0.0.1:3000/';
  }
  async getResource(url:string, prop:ParametrsFetchUrl ) {
    try{
      const id =(prop.id && prop) ? prop.id : '';
      const limit = (prop.limit && prop) ? `&_limit=${prop.limit}` : '';
      const page = (prop.page && prop) ? `?_page=${prop.page}` : '';
      const sort = (prop.sort && prop) ? `&_sorte=${prop.sort}` : '';
      const order = (prop.order && prop) ? `&_sorte=${prop.order}` : '';
      const urlFetch = `${this.url}${url}/${id}${page}${limit}${sort}${order}`;
      const result = await fetch(urlFetch);
      const response:Array<ParametrCar> =  await result.json();
      return response;
    } catch(err) {
      console.log(err)
    }
  }
  
}

class WorkWithCarItem  extends GetResurceCar {
  constructor() {
    super();
  }
  getCarItemById(url:string, id:number) {
    return  this.getResource(url, {id})
  }
  async createCarItem(url:string, data:CreateCar|CreateWinnerCar) {
    const create = await fetch(`${this.url}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const createItem = await create.json();
    return createItem;
  }
  deleteCarItem(url:string, id:number) {
    try{
     return  fetch(`${this.url}${url}/${id}`, {
      method: 'DELETE'
    });
    } catch(err) {
      console.log(err)
    }
  }
  updateCarItem( url:string, id:number, data:CreateCar|CreateWinnerCar) {
    fetch(`${this.url}${url}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
 class ControlsEngineCars extends WorkWithCarItem {
  async controlsEngineCar(id:number, status:string) {
    try{
      const response = await fetch(`${this.url}engine?id=${id}&status=${status}`, {
      method: 'PATCH'
     });
     if(status === 'drive'){
      return response.status;
     }
     return await response.json();
    }catch(err){
      console.log(err)
    }
  }
}
export default class CarsService extends ControlsEngineCars {
  constructor() {
    super();
  }
  getWinnersCar(prop?:ParametrsFetchUrl) {
    const arg = prop ? prop : {};
    return this.getResource('winners', arg);
  }
  getWinnersCarById(id:number) {
    return this.getCarItemById('winners', id);
  }
  createWinnerCarItem(data:CreateWinnerCar) {
    this.createCarItem('winners', data)
  }
  deleteWinnerCarItem(id: number): void {
    this.deleteCarItem('winners', id);
  }
  updateWinnerCarItem(id: number, data:CreateWinnerCar): void {
    this.updateCarItem('winners', id, data);
  }
}