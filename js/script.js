// (IIFE) that creates a private closure.
// pokemonRepository is the only object returned to the global scope.
let pokemonRepository = (function () {
    let pokemonList = [];       
  
    // This is a private array that holds the list of pokemons
    function add(pokemon) {
      pokemonList.push(pokemon);
    }
  // This is a private method that returns the pokemonList array
    function getAll() {
      return pokemonList;
    }
  
    // This is a private method that adds a pokemon to the DOM as a list item with a button
    function addListItem(pokemon) {
      let ul = document.querySelector('.pokemon-list');
      let li = document.createElement('li');
      let button = document.createElement('button');
  
      button.innerHTML = pokemon.name;
      button.classList.add('pokemon-button');
  
       // This is an event listener that calls the showDetails function when the button is clicked
      button.addEventListener('click', function () {
        showDetails(pokemon);
      });
  
      li.appendChild(button);
      ul.appendChild(li);
    }
  
     // This is a private method that logs the pokemon object to the console after loading its details
    function showDetails(pokemon) {
      loadDetails(pokemon).then(function () {
        showModal(pokemon);
      });
    }
  
    // This is a private method that fetches a list of pokemon details from the API
    function loadList() {
      return fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    }

  // This is a private method that fetches the details of a pokemon from its detailsUrl
    function loadDetails(pokemonObj) {
      let url = pokemonObj.detailsUrl;
      return fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (details) {
          pokemonObj.imgUrl = details.sprites.front_default;
          pokemonObj.height = details.height;
        })
        .catch(function (e) {
          console.error(e);
        });
    }
    // Show Pokemon details in a modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function () {
            // Get modal container element and clear existing content
          let modalContainer = document.querySelector('#modal-container');
          modalContainer.innerHTML = ''; // Clear existing content

       // Create modal element
          let modal = document.createElement('div');
          modal.classList.add('modal');
      
            // Create close button element
          let closeButton = document.createElement('button');
          closeButton.classList.add('modal-close');
          closeButton.innerText = 'Close';
          closeButton.addEventListener('click', hideModal);
      
           // Create name element and set text content
          let nameElement = document.createElement('h1');
          nameElement.innerText = pokemon.name;
      
          
          // Create height element
          let heightElement = document.createElement('p');
          heightElement.innerText = `Height: ${pokemon.height}`;

         // Create image element and set source and alt attributes
          let imageElement = document.createElement('img');
          imageElement.src = pokemon.imgUrl;
          imageElement.alt = pokemon.name;

      // Append elements to modal and modal container
          modal.appendChild(closeButton);
          modal.appendChild(nameElement);
          modal.appendChild(heightElement);
          modal.appendChild(imageElement);
          modalContainer.appendChild(modal);
      
           // Show modal
          modalContainer.classList.add('is-visible');
      
          // Add event listener for the Escape key
          document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
              hideModal();
            }
          });
      
          // Add event listener to modal container
          modalContainer.addEventListener('click', function(event) {
            if (event.target === modalContainer) {
              hideModal();
            }
          });
        });
      }
      
      // Hide the modal
      function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
      
        // Remove event listener for the Escape key
        document.removeEventListener('keydown', function(event) {
          if (event.key === 'Escape') {
            hideModal();
          }
        });
      }
      
    // This returns an object that exposes only the public methods of the self-invoking function
     return {
      add: add,
      addListItem: addListItem,
      getAll: getAll,
      showDetails: showDetails,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })();
  
  // This calls the loadList method of the pokemonRepository and populates the DOM with the pokemon list

  pokemonRepository.loadList().then(function () {
    let pokemonList = pokemonRepository.getAll();
    pokemonList.forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });