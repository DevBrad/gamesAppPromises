getGameList().then((arrayOfGames) => {
  for (var i = 0; i < arrayOfGames.length; i++) {
    createDomElement(arrayOfGames[i]);
  }
});

function createDomElement(gameObj) {
  var container1 = document.querySelector(".container");
  const gameELement = document.createElement("div");
  gameELement.setAttribute("id", gameObj._id);
  gameELement.innerHTML = `<h1>${gameObj.title}</h1> 
                            <p>${gameObj.description}</p> 
                            <img src="${gameObj.imageUrl}" />
                            <button class="delete-btn">Delete Game</button>
                            <button class="update-btn">Edit Game</button>`;

  const updateGameElement = document.createElement("div");
  updateGameElement.innerHTML = `<form class="updateForm">
                                    <label for="gameTitle">Title *</label>
                                    <input type="text" value="" name="gameTitle" id="gameTitle"/>
                                    <label for="gameDescription">Description</label>
                                    <textarea name="gameDescription" id="gameDescription"></textarea>
                                    <label for="gameImageUrl">Image URL *</label>
                                    <input type="text" name="gameImageUrl" id="gameImageUrl"/>
                                    <button class="editBtn">Save Changes</button>
                                    <button class="cancelBtn">Cancel</button>
                                  </form>`;

  container1.appendChild(gameELement);

  function clone() {
    let itm = gameELement.childNodes[0].innerText; //h1
    console.log(itm);
    let input = updateGameElement.childNodes[0][0];
    input.value += itm;
    console.log(input.value);
    let itm1 = gameELement.childNodes[2].innerText;
    console.log(itm1);
    let input1 = updateGameElement.childNodes[0][1];
    input1.value += itm1;
    console.log(input1.value);
    let itm2 = gameELement.childNodes[4].getAttribute("src");
    console.log(itm2);
    let input2 = updateGameElement.childNodes[0][2];
    input2.value += itm2;
    console.log(input2.value);
  }

  document
    .getElementById(`${gameObj._id}`)
    .addEventListener("click", function (event) {
      console.log(event.target);
      if (event.target.classList.contains("delete-btn")) {
        deleteGame(gameELement.getAttribute("id")).then((apiResponse) => {
          console.log(apiResponse);
          removeDeletedElementFromDOM(event.target.parentElement);
        });
      } else if (event.target.classList.contains("update-btn")) {
        gameELement.appendChild(updateGameElement);
        clone();
      } else if (event.target.classList.contains("cancelBtn")) {
        removeDeletedElementFromDOM(updateGameElement);
      } else if (event.target.classList.contains("editBtn")) {
        event.preventDefault();

        const updatedGameTitle = updateGameElement.querySelector("#gameTitle")
          .value;
        const updatedGameDescription = updateGameElement.querySelector(
          "#gameDescription"
        ).value;
        const updatedGameImage = updateGameElement.querySelector(
          "#gameImageUrl"
        ).value;

        function updateDom() {
          gameELement.querySelector("h1").innerHTML = updatedGameTitle;
          gameELement.querySelector("p").innerHTML = updatedGameDescription;
          gameELement.querySelector("img").src = updatedGameImage;
        }

        var urlEncoded = new URLSearchParams();
        urlEncoded.append("title", updatedGameTitle);
        urlEncoded.append("description", updatedGameDescription);
        urlEncoded.append("imageUrl", updatedGameImage);

        updateGameRequest(gameELement.getAttribute("id"), urlEncoded).then(
          updateDom
        );
        removeDeletedElementFromDOM(updateGameElement);
      }
    });
}

function removeDeletedElementFromDOM(domElement) {
  domElement.remove();
}

//===============================
// AICI VALIDAM INPUTURILE
function validateFormElement(inputElement, errorMessage) {
  if (inputElement.value === "") {
    if (!document.querySelector('[rel="' + inputElement.id + '"]')) {
      buildErrorMessage(inputElement, errorMessage);
    }
  } else {
    if (document.querySelector('[rel="' + inputElement.id + '"]')) {
      console.log("the error is erased!");
      document.querySelector('[rel="' + inputElement.id + '"]').remove();
      inputElement.classList.remove("inputError");
    }
  }
}

function validateReleaseTimestampElement(inputElement, errorMessage) {
  if (isNaN(inputElement.value) && inputElement.value !== "") {
    buildErrorMessage(inputElement, errorMessage);
  }
}

function buildErrorMessage(inputEl, errosMsg) {
  inputEl.classList.add("inputError");
  const errorMsgElement = document.createElement("span");
  errorMsgElement.setAttribute("rel", inputEl.id);
  errorMsgElement.classList.add("errorMsg");
  errorMsgElement.innerHTML = errosMsg;
  inputEl.after(errorMsgElement);
}

document
  .querySelector(".submitBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const gameTitle = document.getElementById("gameTitle");
    const gameDescription = document.getElementById("gameDescription");
    const gameGenre = document.getElementById("gameGenre");
    const gamePublisher = document.getElementById("gamePublisher");
    const gameImageUrl = document.getElementById("gameImageUrl");
    const gameRelease = document.getElementById("gameRelease");

    validateFormElement(gameTitle, "The title is required!");
    validateFormElement(gameGenre, "The genre is required!");
    validateFormElement(gameImageUrl, "The image URL is required!");
    validateFormElement(gameRelease, "The release date is required!");

    validateReleaseTimestampElement(
      gameRelease,
      "The release date you provided is not a valid timestamp!"
    );

    if (
      gameTitle.value !== "" &&
      gameGenre.value !== "" &&
      gameImageUrl.value !== "" &&
      gameRelease.value !== ""
    ) {
      var urlencoded = new URLSearchParams();
      urlencoded.append("title", gameTitle.value);
      urlencoded.append("releaseDate", gameRelease.value);
      urlencoded.append("genre", gameGenre.value);
      urlencoded.append("publisher", gamePublisher.value);
      urlencoded.append("imageUrl", gameImageUrl.value);
      urlencoded.append("description", gameDescription.value);

      createGameRequest(urlencoded).then(createDomElement);
    }
  });
