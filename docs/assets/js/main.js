"use strict";const inputElement=document.getElementById("search"),buttonElement=document.querySelector(".button-search"),listElement=document.querySelector(".list-shows"),listFavElement=document.querySelector(".list-favorites"),buttonEraseElement=document.querySelector(".button-erase");let favoritesArr=[],favoritesCacheArr=[];function handlerClick(){const e=inputElement.value;fetch(`http://api.tvmaze.com/search/shows?q=${e}`).then(e=>e.json()).then(e=>{listElement.innerHTML="",console.log(e);for(let t=0;t<e.length;t++){const n=e[t].show;console.log(n);const r=n.image,a=createLi(n.name,"show__item"),c=document.createElement("img");if(a.appendChild(c),listElement.appendChild(a),r){const e=n.image.medium;c.src=e}else c.src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"}handlerItem(document.querySelectorAll(".show__item"))})}function createLi(e,t){const n=document.createElement("li");n.setAttribute("class",t);const r=document.createElement("h3"),a=document.createTextNode(e);return r.appendChild(a),n.appendChild(r),n}function handlerEvents(e){const t=e.currentTarget;favorites(t),saveCache(t)}function handlerItem(e){for(let t=0;t<e.length;t++)e[t].addEventListener("click",handlerEvents),e[t].classList.add("non-favorites")}function favorites(e){if(e.classList.contains("non-favorites"))e.classList.remove("non-favorites"),e.classList.add("favorites"),favoritesArr.push(e),createFavoritesList(e);else if(favoritesArr.includes(e)){const t=favoritesCacheArr.indexOf(e);favoritesCacheArr.splice(t,1),console.log("Ya has incluido este show en favoritos")}}function createFavoritesList(e){const t=createLi(e.innerText,"favorites__item"),n=document.createElement("img");n.src=e.lastElementChild.currentSrc,t.appendChild(n),listFavElement.appendChild(t)}function createLiFromCacheObject(e,t){const n=document.createElement("li");n.setAttribute("class",t);const r=document.createElement("h3"),a=document.createTextNode(e.name),c=document.createElement("img");return c.src=e.src,r.appendChild(a),n.appendChild(r),n.appendChild(c),n}function saveCache(e){favoritesCacheArr.push(createObject(e)),localStorage.setItem("favorites",JSON.stringify(favoritesCacheArr))}function createObject(e){return{name:e.innerText,src:e.lastElementChild.currentSrc}}function getCache(){const e=localStorage.getItem("favorites");return JSON.parse(e)}function removeCache(){localStorage.removeItem("favorites")}function fillFavoritesWithUserSearch(e){for(let t=0;t<e.length;t++){const n=createLiFromCacheObject(e[t],"favorites__item");listFavElement.appendChild(n)}}function reloadPage(){const e=getCache();e&&(favoritesCacheArr=e,console.log(favoritesCacheArr),fillFavoritesWithUserSearch(favoritesCacheArr))}function eraseFavorites(){removeCache(),listFavElement.innerHTML=""}buttonElement.addEventListener("click",handlerClick),reloadPage(),buttonEraseElement.addEventListener("click",eraseFavorites);