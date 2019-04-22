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
    //ul
const listElement = document.querySelector('.list');

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
        showItem.setAttribute('class', 'list__item');
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
    const items = document.querySelectorAll('list__item');
    handlerItem(items);
})

}
//Agregar un listener al botón
buttonElement.addEventListener('click', handlerClick);
     

//Favoritos: al hacer clic sobre un resultado el color de fondo y el de fuente se intercambian.
    //Crear un listado (array) con las series favoritas que almacenamos en una variable. Se mostrará en la parte izquierda de la pantalla, debajo del formulario de búqueda.
    //si volvemos a realizar una nueva búsqueda, los favoritos se irán acumulando en nuestra lista.

function changeClass(event){
    const element = event.currentTarget;
    element.classList.toggle('favorites');
}

function handlerItem(items){  
    for(let i = 0; i < items.length; i++){
        items[i].addEventListener('click', changeClass);
    }
}


//Vamos a almacenar el listado de favoritos en el localStorage. De esta forma, al recargar la página el listado de favoritos se mantiene

//Hacer CSS
