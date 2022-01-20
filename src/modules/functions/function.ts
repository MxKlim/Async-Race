export function addClasslistItem(item:HTMLElement, className:string) {
  if(!item.classList.contains(className)){
    item.classList.add(className)
  }
  return 
}
export function removeClasslistItem(item:HTMLElement, className:string) {
  if(item.classList.contains(className)){
    item.classList.remove(className)
  }
  return 
}
export function toggleclassListItem(firstItem:HTMLElement, secondItem:HTMLElement, className:string) {
  if(!firstItem.classList.contains(className)){
    firstItem.classList.add(className)
  }
  if(secondItem.classList.contains(className)){
    secondItem.classList.remove(className)
  }
}
export function makeRandomColor() {
  let color = '';
  while (color.length < 6) {
    color += (Math.random()).toString(16).substr(-6).substr(-1)
  }
  return '#' + color;
}
