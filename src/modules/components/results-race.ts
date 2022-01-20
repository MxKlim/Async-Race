
export default function CreateResultCarHTML(carName:string, time:number) {

  const results = new DocumentFragment();
  const resultCarItem = document.createElement('li');
  const resultCarItemName = document.createElement('p');
  const resultCarItemTime = document.createElement('p');

  resultCarItemName.innerText = carName;
  resultCarItemTime.innerText =`${ time.toString()} s`;
  
  resultCarItem.classList.add('results__item');
  
  resultCarItem.append( resultCarItemName);
  resultCarItem.append(resultCarItemTime);
  results.append(resultCarItem);
 return results
}