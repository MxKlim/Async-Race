
export default function CreatePlaceBlockHTML(img:string, title:string, id:number) {
  const placeBlockFragment = new DocumentFragment();
  const divPlace = document.createElement('div');
  const divControls = document.createElement('div');
  const btnSelect = document.createElement('button');
  const btnRemove = document.createElement('button');
  const paragraphTitile = document.createElement('p');
  const divMove = document.createElement('div');
  const moveBlockControls = document.createElement('div');
  const btnMove = document.createElement('button');
  const btnStop = document.createElement('button');
  const imgBlock = document.createElement('div');


  btnSelect.innerText = 'Select';
  btnRemove.innerText = 'Remove';
  btnMove.innerText = 'D';
  btnStop.innerText = 'S';
  paragraphTitile.innerText = title;

  paragraphTitile.setAttribute('data-name', title);
  paragraphTitile.setAttribute('data-id', `${id}`);
  btnMove.setAttribute('data-type', 'drive');
  btnMove.setAttribute('data-id', `${id}`);
  btnStop.setAttribute('data-id', `${id}`);
  btnStop.setAttribute('data-type', 'stop');
  btnStop.setAttribute('disabled', 'true');
  btnSelect.setAttribute('data-id', `${id}`);
  btnSelect.setAttribute('data-type', 'select');
  btnRemove.setAttribute('data-id', `${id}`);
  btnRemove.setAttribute('data-type', 'remove');
  divPlace.setAttribute('data-id', `${id}`);
  imgBlock.setAttribute('data-block', `${id}`);
  

  btnMove.classList.add('btn-move');
  btnStop.classList.add('btn-stop');
  divPlace.classList.add('race-place');
  divControls.classList.add('race-control');
  btnSelect.classList.add('btn-form');
  btnRemove.classList.add('btn-form');
  paragraphTitile.classList.add('name-care-title');
  divMove.classList.add('move-block');
  btnMove.classList.add('btn-move');
  imgBlock.classList.add('img-block', 'js_car_block');

  imgBlock.innerHTML = `${img}`;
  moveBlockControls.append(btnMove);
  moveBlockControls.append(btnStop);
  divMove.append(moveBlockControls);
  divMove.append(imgBlock);
  divControls.append(btnSelect);
  divControls.append(btnRemove);
  divControls.append(paragraphTitile);
  divPlace.append(divControls);
  divPlace.append(divMove);
  divPlace.append(divMove);
  placeBlockFragment.append(divPlace);

  return placeBlockFragment;
}