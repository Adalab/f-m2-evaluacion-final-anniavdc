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
const buttonElement = document.querySelector('.button');
    //ul shows
const listElement = document.querySelector('.list-shows');
    //ul favorites
const listFavElement = document.querySelector('.list-favorites');
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
        
        const item = document.createElement('li');
        item.setAttribute('class', 'show__item');
        const title = document.createTextNode(showObject.name);
        const image = document.createElement('img');
        item.appendChild(image);
        item.appendChild(title);
        listElement.appendChild(item);
        
        //if
        if(!showImageObject){
            //el show no tiene imagen, crear una imagen de relleno con placeholder https://via.placeholder.com/210x295/ffffff/666666/?text=TV
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
    }
}
  

//Crear un listado (array) con las series favoritas que almacenamos en una variable. Se mostrará en la parte izquierda de la pantalla, debajo del formulario de búqueda.

function favorites(element){
        element.classList.toggle('favorites');
        if(element.classList.contains('favorites')){
            favoritesArr.push(element);
            createFavoritesList(element);
        }
        
}
//si volvemos a realizar una nueva búsqueda, los favoritos se irán acumulando en nuestra lista.
function createFavoritesList(element){
    console.log(element);
    
    const item = document.createElement('li');
    item.setAttribute('class', 'favorites__item')
    const itemContent = document.createTextNode(element.innerText);
    const image = document.createElement('img');
    image.src = element.lastElementChild.currentSrc;

    item.appendChild(itemContent);
    item.appendChild(image);
    listFavElement.appendChild(item);
}

//Vamos a almacenar el listado de favoritos en el localStorage. De esta forma, al recargar la página el listado de favoritos se mantiene
function createLiFromCacheObject(object, itemClass){
    const item = document.createElement('li');
    item.setAttribute('class', itemClass);
    const title = document.createTextNode(object.name);
    const image = document.createElement('img');
    image.src = object.src;
    item.appendChild(image);
    item.appendChild(title);
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

//Hacer CSS
//BONUS
 
