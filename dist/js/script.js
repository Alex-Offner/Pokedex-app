let pokemonRepository = (function() {
  let e = [],
    t = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  function n(t) {
    'object' == typeof t && 'name' in t && 'detailsUrl' in t
      ? e.push(t)
      : /* eslint-disable no-console */
        console.log(
          /* eslint-enable no-console */
          'The data you want to push is not an object or is missing a required key like name, height, types or number'
        );
  }
  function o() {
    let e = document.querySelector('.remove');
    document.querySelector('.loadingMessage').removeChild(e);
  }
  function r(e) {
    let t = e.detailsUrl;
    return fetch(t)
      .then(function(e) {
        return e.json();
      })
      .then(function(t) {
        (e.imageUrl = t.sprites.front_default), (e.height = t.height);
        let n = [];
        t.types.forEach(function(e) {
          n.push(e.type.name);
        }),
          (e.types = n.join(', '));
      })
      .catch(function(e) {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-enable no-console */
      });
  }
  /* eslint-disable no-undef */
  function i({ name: e, height: t, types: n, imageUrl: o } = pokemon) {
    /* eslint-enable no-undef */
    let r = document.querySelector('.modal-body'),
      i = document.querySelector('.modal-title');
    (i.innerHTML = ''), (r.innerHTML = '');
    let a = document.createElement('h2');
    a.innerText = e;
    let l = document.createElement('p');
    l.innerText = 'height: ' + t;
    let c = document.createElement('p');
    c.innerText = 'types: ' + n;
    let d = document.createElement('img');
    d.classList.add('modal-img'),
      (d.style.width = '50%'),
      (d.src = o),
      i.appendChild(a),
      r.appendChild(l),
      r.appendChild(c),
      r.appendChild(d);
  }
  return {
    add: n,
    getAll: function() {
      return e;
    },
    addPokemon: function(e) {
      let t = document.querySelector('.list-group'),
        n = document.createElement('li');
      n.classList.add('list-group-item');
      let o = document.createElement('button');
      (o.innerText = e.name),
        o.classList.add('btn', 'btn-primary'),
        o.setAttribute('data-toggle', 'modal'),
        o.setAttribute('data-target', '#exampleModalCenter'),
        (function(e, t) {
          e.addEventListener('click', function() {
            r(t).then(function() {
              i(t);
            });
          });
        })(o, e),
        n.appendChild(o),
        t.appendChild(n);
    },
    loadList: function() {
      return (
        (function() {
          let e = document.querySelector('.loadingMessage'),
            t = document.createElement('p');
          (t.innerText = 'Loading! Please wait.'),
            t.classList.add('remove'),
            e.appendChild(t);
        })(),
        fetch(t)
          .then(function(e) {
            return e.json();
          })
          .then(function(e) {
            o(),
              e.results.forEach(function(e) {
                n({ name: e.name, detailsUrl: e.url });
              });
          })
          .catch(function(e) {
            /* eslint-disable no-console */
            console.error(e), o();
            /* eslint-enable no-console */
          })
      );
    },
    loadDetails: r,
    searchBar: function() {
      document.getElementById('searchBar').addEventListener('keyup', e => {
        let t = e.target.value.toLowerCase();
        document.querySelectorAll('.list-group-item').forEach(e => {
          e.innerText.indexOf(t) > -1
            ? (e.style.display = '')
            : (e.style.display = 'none');
        });
      });
    }
  };
})();
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(e) {
    pokemonRepository.addPokemon(e);
  });
}),
  pokemonRepository.searchBar();
let body = document.querySelector('.check'),
  hamburgerButton = document.querySelector('.navbar-toggler');
hamburgerButton.addEventListener('click', function() {
  body.classList.contains('navbar-extend')
    ? body.classList.remove('navbar-extend')
    : body.classList.add('navbar-extend');
});
