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

  // Function to add a list item for a pokemon to the unordered list on the page
  function addListItem(pokemon) {
    let ul = $(".list-group");
    let li = $("<li></li>").addClass("list-group-item");
    let button = $("<button></button>")
      .addClass("btn btn-danger pokemon-button")
      .html(pokemon.name);

    // Add data attribute to button that references the index of the corresponding Pokemon in the pokemonList array
    button.attr("data-index", pokemonList.indexOf(pokemon));

    // This is an event listener that calls the showDetails function when the button is clicked
    button.on("click", function () {
      let index = $(this).data("index");
      let pokemon = pokemonList[index];
      showDetails(pokemon);
    });

    // Append the button to the list item and the list item to the unordered list
    li.append(button);
    ul.append(li);
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
            detailsUrl: item.url,
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

  function showDetails(pokemon) {
    // load additional details about the pokemon
    loadDetails(pokemon).then(function () {
      // create the modal and its contents
      let modal = $(
        '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>'
      );
      let modalDialog = $(
        '<div class="modal-dialog modal-dialog-centered" role="document"></div>'
      );

      let modalContent = $('<div class="modal-content"></div>');
      let modalHeader = $('<div class="modal-header"></div>');
      let modalTitle = $('<h5 class="modal-title">' + pokemon.name + "</h5>");
      let closeButton = $(
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
      );
      let modalBody = $('<div class="modal-body"></div>');
      let heightElement = $("<p></p>").text("Height: " + pokemon.height);
      let imageElement = $("<img>")
        .attr("src", pokemon.imgUrl)
        .attr("alt", pokemon.name);

      // Add an event listener to the closeButton that calls the hide method of the modal
      closeButton.on("click", function () {
        modal.modal("hide");
      });

      // append elements to modal
      modalHeader.append(modalTitle);
      modalHeader.append(closeButton);
      modalBody.append(heightElement);
      modalBody.append(imageElement);
      modalContent.append(modalHeader);
      modalContent.append(modalBody);
      modalDialog.append(modalContent);
      modal.append(modalDialog);

      // add modal to body
      $("body").append(modal);

      // show the modal
      modal.modal("show");
    });
  }

  // This returns an object that exposes only the public methods of the self-invoking function
  return {
    add: add,
    addListItem: addListItem,
    getAll: getAll,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

// This calls the loadList method of the pokemonRepository and populates the DOM with the pokemon list

pokemonRepository.loadList().then(function () {
  let pokemonList = pokemonRepository.getAll();
  pokemonList.forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
