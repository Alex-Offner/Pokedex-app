
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

//This function searches pokemon by name and shows their object in the array
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
    loadDetails(pokemon).then(function () {
    showModal(pokemon);
    //showDetails(pokemon);
    });
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
    let types = [];
    details.types.forEach(function(detailsType) {
      types.push(detailsType.type.name)
    });
    item.types = types.join(', ');
  }).catch(function (e) {
    console.error(e);
  });
}

//Using object destructuring here, to access keys better in line 59 (showModal(pokemon))
function showModal({name, height, types, imageUrl}=pokemon) {
  let modalContainer = document.querySelector('#modal-container');
  modalContainer.innerHTML = '';
  let modal = document.createElement('div');
  modal.classList.add('modal');

  let closeButtonElement = document.createElement('button');
  closeButtonElement.classList.add('modal-close');
  closeButtonElement.innerText = 'Close';
  closeButtonElement.addEventListener('click', hideModal);

  let nameElement = document.createElement ('h2');
  nameElement.innerText = name;

  let hightElement = document.createElement('p');
  hightElement.innerText = 'height: ' + height;

  let typeElement = document.createElement('p');
  typeElement.innerText = 'types: ' + types;

  let imgElement = document.createElement('img');
  imgElement.src = imageUrl;

  modal.appendChild(closeButtonElement);
  modal.appendChild(nameElement);
  modal.appendChild(hightElement);
  modal.appendChild(typeElement);
  modal.appendChild(imgElement);
  modalContainer.appendChild(modal);

  modalContainer.classList.add('is-visible');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
    modalContainer.classList.remove('is-visible');
  }

  modalContainer.addEventListener('click', (e) => {
  let target = e.target;
  if(target === modalContainer) {
    hideModal();
  }
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
