'use strict';

//Hacer HTML básico
    //h1 Buscador de series
    //input
    //boton
    //ul
//Recoger los elementos en js
    //input
const inputElement = document.getElementById('search');
    //boton
const buttonElement = document.querySelector('.button-search');
    //ul shows
const listElement = document.querySelector('.list-shows');
    //ul favorites
const listFavElement = document.querySelector('.list-favorites');
const buttonEraseElement = document.querySelector('.button-erase');
    //array vacío
let favoritesArr = [];
let favoritesCacheArr = [];

//fetch a URL de TVMaze
function handlerClick(){
const userSearch = inputElement.value;
fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`)
.then(response => response.json())
.then(showData =>{
    listElement.innerHTML = '';
    //Ver que tipo de data nos regresa el fetch: array de objetos 
    console.log(showData);
    //Por cada show contenido en el resultado de búsqueda debemos pintar una tarjeta donde mostramos una imagen de la serie y el título.
    for(let i = 0; i < showData.length; i++){
        
        const showObject = showData[i].show;
        console.log(showObject);
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
    
})

}
function createLi(titleRoute, itemClass){
        const item = document.createElement('li');
        item.setAttribute('class', itemClass);
        const titleContainer = document.createElement('h3');
        const title = document.createTextNode(titleRoute);

        titleContainer.appendChild(title);
        item.appendChild(titleContainer);
        
        return item
}
//Agregar un listener al botón
buttonElement.addEventListener('click', handlerClick);

//Favoritos: al hacer clic sobre un resultado el color de fondo y el de fuente se intercambian.
function handlerEvents(event) {
    const element = event.currentTarget;
    favorites(element);
    saveCache(element);
}

function handlerItem(items){
    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener('click', handlerEvents);
      items[i].classList.add('non-favorites');
    }
}
  

//Crear un listado (array) con las series favoritas que almacenamos en una variable. Se mostrará en la parte izquierda de la pantalla, debajo del formulario de búqueda.

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

//si volvemos a realizar una nueva búsqueda, los favoritos se irán acumulando en nuestra lista.
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
    console.log(buttonsItem);
    
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
//Vamos a almacenar el listado de favoritos en el localStorage. De esta forma, al recargar la página el listado de favoritos se mantiene
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
    return item
}

function saveCache(element){
    favoritesCacheArr.push(createObject(element));
    localStorage.setItem('favorites', JSON.stringify(favoritesCacheArr));
}

function createObject(element){ 
    return {name:element.innerText, src: element.lastElementChild.currentSrc}
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
        console.log(favoritesCacheArr);
        
        fillFavoritesWithUserSearch(favoritesCacheArr);
    }
}
reloadPage();

function eraseFavorites(){
    removeCache();
    listFavElement.innerHTML = '';
}

buttonEraseElement.addEventListener('click', eraseFavorites);
 
