export interface CreateWinnerCar {
  id?: number,
  wins: number,
  time: number
}
export interface CreateCar {
  name:string,
  color:string
}
export interface ParametrsFetchUrl {
  id?: number|undefined,
  limit?:number|undefined,
  page?:number|undefined,
  sort?:string,
  order?:string,
}
export interface ParametrCar extends CreateWinnerCar {
  [index: string]: string|number;
  name:string,
  color:string, 
  id:number
}
export interface LocalParametrs {
 [x: number]: number[];
}