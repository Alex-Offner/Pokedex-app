
/*This IIFE (Immediately Invoked Functional Expression) holds a pokemonList and
two functions to call them and push a new pokemon; it is only globaly accessible
by calling pokemonRepository */

let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

function add(pokemon) {
  if (typeof pokemon === 'object' &&
  'name' in pokemon &&
  'detailsUrl' in pokemon
  ) {
  pokemonList.push(pokemon);
} else {
  console.log('The data you want to push is not an object or is missing a required key like name, height, types or number');
}
}

function getAll() {
  return pokemonList;
}

function search(pokemon) {
  if (pokemonList.find(item =>item.name === pokemon)) {
    console.log(pokemonList.filter(item => item.name.includes(pokemon)));
  } else {
    console.log(pokemon + ' does not exists');
  }
}

/*The following functions create buttons in the element with the class
"pokemonList" and calls the addListener to button function */
function addPokemon(pokemon) {
  let pokeList = document.querySelector('.pokemonList');
  let listPokemon = document.createElement('li');
  let button = document.createElement('button');
  button.innerText = pokemon.name;
  button.classList.add('pokemonButton');
  addListenerToButton(button, pokemon);
  listPokemon.appendChild(button);
  pokeList.appendChild(listPokemon);
}

//This functions shows pokemon in console if called
function showDetails (pokemon) {
  loadDetails(pokemon).then(function () {
    console.log(pokemon);
  });
}
/*This function adds an EventListener to an object called button and calls
showDetails function */
function addListenerToButton (button, pokemon) {
  button.addEventListener('click', function(event) {
    showDetails(pokemon);
  });
}

function showLoadingMessage() {
    let div = document.querySelector('.loadingMessage');
    let message = document.createElement('p');
    message.innerText = 'Loading! Please wait.';
    message.classList.add('remove');
    div.appendChild(message);
  }

function hideLoadingMessage() {
    let removableMessage =
    document.querySelector('.remove');
    document.querySelector('.loadingMessage').removeChild(removableMessage);
    }


function loadList() {
  showLoadingMessage();
  return fetch(apiUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    hideLoadingMessage();
    json.results.forEach(function(item) {
      let pokemon = {
        name: item.name,
        detailsUrl: item.url
      };
      add(pokemon);
    });
  }).catch(function (e) {
    console.error(e);
    hideLoadingMessage();
  })
}

function loadDetails(item) {
  let url = item.detailsUrl;
  return fetch(url).then(function (response){
    return response.json();
  }).then(function (details) {
    item.imageUrl = details.sprites.front_default;
    item.height = details.height;
    item.types = details.types;
  }).catch(function (e) {
    console.error(e);
  });
}

return {
  add: add,
  getAll: getAll,
  addPokemon: addPokemon,
  search: search,
  loadList: loadList,
  loadDetails: loadDetails
};
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addPokemon(pokemon);
  });
});
