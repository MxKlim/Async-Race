
export default function CreateResultListHTML(id:number, number:number, img:string, carName:string, wins:number,  time:number) {
  const results = new DocumentFragment();
  const ul = document.createElement('ul');
  const resultCarItemNumber = document.createElement('li');
  const resultCarItemImg = document.createElement('li');
  const resultCarItemName = document.createElement('li');
  const resultCarItemWins = document.createElement('li');
  const resultCarItemTime = document.createElement('li');

  resultCarItemNumber.innerText = number.toString();
  resultCarItemImg.innerHTML = img;
  resultCarItemName.innerText = carName;
  resultCarItemWins.innerText = wins.toString();
  resultCarItemTime.innerText = `${time/1000} s`;
  
  resultCarItemNumber.classList.add('info-car-item');
  resultCarItemImg.classList.add('info-car-item');
  resultCarItemName.classList.add('info-car-item');
  resultCarItemWins.classList.add('info-car-item');
  resultCarItemTime.classList.add('info-car-item');
  ul.classList.add('wins-car-list');
  ul.setAttribute('data-car', `${id}`);
  
  ul.append(resultCarItemNumber);
  ul.append(resultCarItemImg);
  ul.append(resultCarItemName);
  ul.append(resultCarItemWins);
  ul.append(resultCarItemTime);
  results.append(ul)
 return results
}