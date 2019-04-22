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
const favoritesArr = [];

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
        const showImageObject = showObject.image;
        
        const showItem = document.createElement('li');
        showItem.setAttribute('class', 'show__item');
        const showTitle = document.createTextNode(showObject.name);
        const showImage = document.createElement('img');
        showItem.appendChild(showImage);
        showItem.appendChild(showTitle);
        listElement.appendChild(showItem);
        
        //if
        if(!showImageObject){
            //el show no tiene imagen, crear una imagen de relleno con placeholder https://via.placeholder.com/210x295/ffffff/666666/?text=TV
            showImage.src = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }else{
            const showOwnImage = showObject.image.medium;
            showImage.src = showOwnImage; 
        }  
    }
    const items = document.querySelectorAll('.show__item');
    handlerItem(items);
    console.log(favoritesArr);
    
})

}
//Agregar un listener al botón
buttonElement.addEventListener('click', handlerClick);

//Favoritos: al hacer clic sobre un resultado el color de fondo y el de fuente se intercambian.
function changeClass(event) {
    const element = event.currentTarget;
    element.classList.toggle('favorites'); 

    favorites(element);
    saveCache(element);
}

function handlerItem(items){
    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener('click', changeClass);
    }
}
  

//Crear un listado (array) con las series favoritas que almacenamos en una variable. Se mostrará en la parte izquierda de la pantalla, debajo del formulario de búqueda.

function favorites(element){
        if(element.classList.contains('favorites')){
            favoritesArr.push(element);
            
            createFavoritesList(element);
        }
        
}

function createFavoritesList(element){

    const favoritesList = document.createElement('li');
    favoritesList.setAttribute('class', 'favorites__item')
    const favoritesContent = document.createTextNode(element.innerText);
    const favoritesImage = document.createElement('img');
    favoritesImage.src = element.lastElementChild.currentSrc;

    favoritesList.appendChild(favoritesContent);
    favoritesList.appendChild(favoritesImage);
    listFavElement.appendChild(favoritesList);
}
//si volvemos a realizar una nueva búsqueda, los favoritos se irán acumulando en nuestra lista.

//Vamos a almacenar el listado de favoritos en el localStorage. De esta forma, al recargar la página el listado de favoritos se mantiene
function saveCache(element){
    localStorage.setItem('favorites', JSON.stringify(element.innerText));
}

//Hacer CSS
