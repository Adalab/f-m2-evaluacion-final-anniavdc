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
        const showImageObject = showObject.image;

        const item = createLi(showObject.name, 'show__item');
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
}
function handlerItem(items){
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', handlerEvents);
    items[i].classList.add('non-favorites');
  }
}
function favorites(element){
  if(element.classList.contains('non-favorites')){
    element.classList.remove('non-favorites');
    element.classList.add('favorites');
    favoritesArr.push(element);
    createFavoritesList(element);
    saveCache(element);
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

  handlerBtnFavorites(buttonsItem);
}

function handlerBtnFavorites(items){
  for(let i = 0; i < items.length; i++){
    items[i].addEventListener('click', deleteFavElement);
  }
}


function deleteFavElement(event){
  const element = event.currentTarget;

  deleteFavElementFromList(favoritesArr, element);

  deleteFavElementFromCache(element);
  localStorage.setItem('favorites', JSON.stringify(favoritesCacheArr));
}

function deleteFavElementFromList(arr, element){
  const parentElement = element.parentNode;

  const elementIndex = arr.indexOf(parentElement);
  arr.splice(elementIndex, 1);
  listFavElement.removeChild(parentElement);
}
function deleteFavElementFromCache(element){
  const parentElement = element.parentNode;
  const imgElement = parentElement.querySelector('img');
  const src = imgElement.src;

  // const elementIndexCache = favoritesCacheArr.findIndex((item) =>{
  //   return item.src === src;
  // });
  const elementIndexCache = favoritesCacheArr.findIndex(item => item.src === src);
  favoritesCacheArr.splice(elementIndexCache, 1); 
}

function createLiFromCacheObject(object, itemClass){
  const item = document.createElement('li');
  item.setAttribute('class', itemClass);
  const titleContainer = document.createElement('h3');
  const title = document.createTextNode(object.name);
  const image = document.createElement('img');
  image.src = object.src;
  titleContainer.appendChild(title);
  const buttonItem = document.createElement('button');
  buttonItem.setAttribute('class', 'button-item');
  buttonItem.innerText = 'x';

  item.appendChild(titleContainer);
  item.appendChild(buttonItem);
  item.appendChild(image);
  listFavElement.appendChild(item);

  const buttonsItem = document.querySelectorAll('.button-item');
  handlerBtnFavorites(buttonsItem);

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

