/*This IIFE (Immediately Invoked Functional Expression) holds a pokemonList and multible functions; it is only globaly accessible
by calling pokemonRepository */

let pokemonRepository = (function() {
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
    if (pokemonList.find(item => item.name === pokemon)) {
      console.log(pokemonList.filter(item => item.name.includes(pokemon)));
    } else {
      console.log(pokemon + ' does not exists');
    }
  }

  /*The following functions create buttons in the element with the bootstrap classes and attributes to call the modal */
  function addPokemon(pokemon) {
    let pokeList = document.querySelector('.list-group');
    let listPokemon = document.createElement('li');
    listPokemon.classList.add('list-group-item');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModalCenter');
    addListenerToButton(button, pokemon);
    listPokemon.appendChild(button);
    pokeList.appendChild(listPokemon);
  }


  //This functions shows pokemon in console if called
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      console.log(pokemon);
    });
  }
  /*This function adds an EventListener to an object called button and calls
  showDetails function */
  function addListenerToButton(button, pokemon) {
    button.addEventListener('click', function(event) {
      loadDetails(pokemon).then(function() {
        showModal(pokemon);
        //showDetails(pokemon);
      });
    });
  }

  // This function adds a Loading Message to the HTML document
  function showLoadingMessage() {
    let div = document.querySelector('.loadingMessage');
    let message = document.createElement('p');
    message.innerText = 'Loading! Please wait.';
    message.classList.add('remove');
    div.appendChild(message);
  }

  //This function hides the loading message again
  function hideLoadingMessage() {
    let removableMessage =
      document.querySelector('.remove');
    document.querySelector('.loadingMessage').removeChild(removableMessage);
  }

  /* This function catches the json from the apiURL and transforms it into an array.
  Then it calls the add pokemon function and catches any errors occuring*/
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
    }).catch(function(e) {
      console.error(e);
      hideLoadingMessage();
    })
  }

  //This function fetches more details from the json (height, imgUrl, types )
  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      let types = [];
      details.types.forEach(function(detailsType) {
        types.push(detailsType.type.name)
      });
      item.types = types.join(', ');
    }).catch(function(e) {
      console.error(e);
    });
  }
  /*This function creats elements and adds them to the modal
  Using object destructuring here, to access keys better in line 59 (showModal(pokemon)) */
  function showModal({
    name,
    height,
    types,
    imageUrl
  } = pokemon) {
    let modalContainer = document.querySelector('.modal');
    let modalBody = document.querySelector('.modal-body');
    let modalTitle = document.querySelector('.modal-title');
    let modalHeader = document.querySelector('.modal-header');

    //Use this to empty HTML of modal everytime before it is called
    modalTitle.innerHTML = '';
    modalBody.innerHTML = '';

    let nameElement = document.createElement('h2');
    nameElement.innerText = name;

    let hightElement = document.createElement('p');
    hightElement.innerText = 'height: ' + height;

    let typeElement = document.createElement('p');
    typeElement.innerText = 'types: ' + types;

    let imgElement = document.createElement('img');
    imgElement.classList.add('modal-img');
    imgElement.style.width = "50%";
    imgElement.src = imageUrl;

    modalTitle.appendChild(nameElement);
    modalBody.appendChild(hightElement);
    modalBody.appendChild(typeElement);
    modalBody.appendChild(imgElement);

  }

  /*This function adds display: "none" to the HTML elements with the "list-group-item" class, if they don't include the string in the searchBar */
  function searchBar() {
    let searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('keyup', (e) => {
      let searchString = e.target.value.toLowerCase();
      let pokemonOnHTML = document.querySelectorAll('.list-group-item');

      pokemonOnHTML.forEach((searchedPokemon) => {
        if (searchedPokemon.innerText.indexOf(searchString) > -1) {
          searchedPokemon.style.display = '';
        } else {
          searchedPokemon.style.display = 'none';
        }
      });
    });
  }

  return {
    add: add,
    getAll: getAll,
    addPokemon: addPokemon,
    search: search,
    loadList: loadList,
    loadDetails: loadDetails,
    searchBar: searchBar
  };
})();

/*This function adds each pokemon to the repository, and puts all of them in the pokemonList (through the getAll function). The the list is loaded into the HTML document */
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addPokemon(pokemon);
  });
});

pokemonRepository.searchBar();

let body = document.querySelector('.check');
let hamburgerButton = document.querySelector('.navbar-toggler');

hamburgerButton.addEventListener('click', function (event) {
  if(body.classList.contains('navbar-extend')) {
    body.classList.remove('navbar-extend');
  } else {
    body.classList.add('navbar-extend');
  }
});
