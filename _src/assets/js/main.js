'use strict';

const inputElement = document.getElementById('search');
const buttonElement = document.querySelector('.button-search');
const listElement = document.querySelector('.list-shows');
const listFavElement = document.querySelector('.list-favorites');
const buttonEraseElement = document.querySelector('.button-erase');

let favoritesArr = [];
let favoritesCacheArr = [];

function handlerClick(){
  const userSearch = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`)
    .then(response => response.json())
    .then(showData =>{
      listElement.innerHTML = '';
      for(let i = 0; i < showData.length; i++){
        const showObject = showData[i].show;
        console.log(showObject);
        const showDaysObject = showObject.schedule;
        console.log(showDaysObject);
        const showDaysArr = showDaysObject.days;

        const item = createLi(showObject.name, 'show__item');
        for( let i = 0; i < showDaysArr.length; i++){
          const day = document.createElement('p');
          const dayContent = document.createTextNode(showDaysArr[i]);
          day.appendChild(dayContent);
          item.appendChild(day);
        }
        
        
        const showImageObject = showObject.image;

        const image = document.createElement('img');
        item.appendChild(image);
        listElement.appendChild(item);

        if(!showImageObject){
          image.src = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }else{
          const showOwnImage = showObject.image.medium;
          image.src = showOwnImage;
        }
      }
      const items = document.querySelectorAll('.show__item');
      handlerItem(items);

    });

}
function createLi(titleRoute, itemClass){
  const item = document.createElement('li');
  item.setAttribute('class', itemClass);
  const titleContainer = document.createElement('h3');
  const title = document.createTextNode(titleRoute);

  titleContainer.appendChild(title);
  item.appendChild(titleContainer);

  return item;
}

buttonElement.addEventListener('click', handlerClick);

function handlerEvents(event) {
  const element = event.currentTarget;
  favorites(element);
  saveCache(element);
}
function handlerItem(items){
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', renderName);
    items[i].classList.add('non-favorites');
  }
}
function renderName(event){
  const element =  event.currentTarget;
  const title = element.querySelector('h3');
  console.log(title.innerText);

}
function favorites(element){
  if(element.classList.contains('non-favorites')){
    element.classList.remove('non-favorites');
    element.classList.add('favorites');
    favoritesArr.push(element);
    createFavoritesList(element);
  }else if(favoritesArr.includes(element)){
    const duplicated = favoritesCacheArr.indexOf(element);
    favoritesCacheArr.splice(duplicated, 1);
    console.log('Ya has incluido este show en favoritos');
  }
}

function createFavoritesList(element){
  const item = createLi(element.innerText, 'favorites__item');
  const image = document.createElement('img');
  image.src = element.lastElementChild.currentSrc;

  const buttonItem = document.createElement('button');
  buttonItem.setAttribute('class', 'button-item');
  buttonItem.innerText = 'x';

  item.appendChild(buttonItem);
  item.appendChild(image);
  listFavElement.appendChild(item);

  const buttonsItem = document.querySelectorAll('.button-item');

  handlerFavorites(buttonsItem);
}

function handlerFavorites(items){
  for(let i = 0; i < items.length; i++){
    items[i].addEventListener('click', handlerFavEvents);
  }
}

function handlerFavEvents(event){
  const element = event.currentTarget;
  element.parentElement.innerHTML = '';
}

function createLiFromCacheObject(object, itemClass){
  const item = document.createElement('li');
  item.setAttribute('class', itemClass);
  const titleContainer = document.createElement('h3');
  const title = document.createTextNode(object.name);
  const image = document.createElement('img');
  image.src = object.src;
  titleContainer.appendChild(title);
  item.appendChild(titleContainer);
  item.appendChild(image);
  return item;
}

function saveCache(element){
  favoritesCacheArr.push(createObject(element));
  localStorage.setItem('favorites', JSON.stringify(favoritesCacheArr));
}

function createObject(element){
  return {name:element.innerText, src: element.lastElementChild.currentSrc};
}

function getCache(){
  const arrString = localStorage.getItem('favorites');
  const arrParse = JSON.parse(arrString);

  return arrParse;
}

function removeCache(){
  localStorage.removeItem('favorites');
}

function fillFavoritesWithUserSearch(arr){
  for(let i = 0; i < arr.length; i++){
    const li = createLiFromCacheObject(arr[i],'favorites__item');
    listFavElement.appendChild(li);
  }
}
function reloadPage(){
  const userSearchFromCache = getCache();
  if(userSearchFromCache){
    favoritesCacheArr = userSearchFromCache;

    fillFavoritesWithUserSearch(favoritesCacheArr);
  }
}
reloadPage();

function eraseFavorites(){
  removeCache();
  listFavElement.innerHTML = '';
}

buttonEraseElement.addEventListener('click', eraseFavorites);

