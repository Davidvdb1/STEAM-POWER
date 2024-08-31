import ClassroomService from "../../service/classroom.service.js";
import CardService from "../../service/card.service.js";
import cardService from "../../service/card.service.js";

class EnergyVoorwerpOverview extends HTMLElement {
  constructor() {
    super();
    this.energy = 0.00;
    this.cards = []; // Array to store card data

    this.fetchEnergy = (value) => {
      if (this.energy !== value) {
        this.energy = value;
        this.generateHtml();
      }
    };

    this.eventListeners = [];

    classroomEnergyObserver.setFetchEnergy(ClassroomService.fetchClassroomById);
    classroomEnergyObserver.subscribe({ name: 'energy-item-fetchEnergy', cb: this.fetchEnergy });
  }

  registerEventListener = (element, type, cb) => {
    element.addEventListener(type, cb);
    this.eventListeners.push({element: element, type: type, cb: cb});
  }

  async loadCardsFromDatabase() {
    try {
      this.cards = await CardService.fetchAllCards();

      console.log('Cards data:', this.cards);
      this.generateHtml();
    } catch (error) {
      console.error(error);
      this.innerHTML = `
      <div class="error">
        <h2>Error loading cards</h2>
        <p>${error.message}</p>
      </div>
    `;
    }
  }

  async createCard(cardData) {
    try {
      const newCardId = await CardService.createCard(cardData);
      console.log('New card ID:', newCardId);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  }

  async connectedCallback() {
    this.innerHTML = `
            <div class="card-container"></div>
        `;
    setTimeout(async () => {
      await this.loadCardsFromDatabase();
    })

    this.innerHTML += `
      <form id="newCardForm">
      <style>
                  #error-messages {
                      margin-top: 1rem;
                      padding: 0.5rem;
                      border: 1px solid #dc3545; /* Red border */
                      background-color: #f8d7da; /* Light red background */
                      color: #721c24; /* Dark red text color */
                      border-radius: 0.25rem;
                      display: none;
                  }

                  #error-messages div {
                      margin-bottom: 0.5rem;
                  }
                </style>
                <div id="error-messages" class="text-danger"></div>
        <input type="number" id="energyRequirement" name="energyRequirement" placeholder="Energy Requirement" required>
        <input type="text" id="title" name="title" placeholder="Title" required>
        <textarea id="description" name="description" placeholder="Description" required></textarea>
        <input type="number" id="multiplier" name="multiplier" placeholder="Multiplier" required>
        <input type="text" id="poweredDevice" name="poweredDevice" placeholder="Powered Device">
        <div class="file-input-container" style="margin-top: 1rem;">
                        <input type="file" id="contentFile" class="content-file-input">
                        <label for="contentFile" id="contentFileLabel" class="content-file-label">Kies bestand</label>
                        <span id="fileNameDisplay" class="file-name-display"></span>
                    </div>
        <button type="submit">Create Card</button>
      </form>
    `;

    let cardToUpload = null;

    this.registerEventListener(document.getElementById('newCardForm'), 'submit', async function (event){
      event.preventDefault();

      const cardEnergyRequirement = document.getElementById('energyRequirement').value;
      const cardTitle = document.getElementById('title').value;
      const cardDescription = document.getElementById('description').value;
      const cardMultiplier = document.getElementById('multiplier').value;
      const cardPoweredDevice = document.getElementById('poweredDevice').value;
      const formData = new FormData();
      const uniqueIdentifiers = [];

      const fileElement = document.getElementById('contentFile');
      let content = {};
      if (fileElement.files[0]){
        const uniqueIdentifier = generateUniqueIdentifier();
        const file = fileElement.files[0];
        formData.append('files', file);
        uniqueIdentifiers.push(uniqueIdentifier);

        content = {
          fileData : file.name,
          fileUid : uniqueIdentifier
        };
      }
      const cardData = {
        energyRequirement: cardEnergyRequirement,
        title: cardTitle,
        description: cardDescription,
        multiplier:  cardMultiplier,
        poweredDevice: cardPoweredDevice,
        image2: content
      };

      formData.append('fileIdentifiers', JSON.stringify(uniqueIdentifiers));

      formData.append('cardData', JSON.stringify(cardData));

      try{
        let response = await cardService.createCard(formData);
        console.log(response);
        if (response.ok){
          console.log('Card created successfully');
        }
        if (response.status === 400 ) {
          const errorData = await response.json();
          if (errorData.explanation){
            displayErrors(errorData.explanation);
          }
        }
        else {
          console.error('Failed to create card');
        }
      } catch (error) {
        console.error('Error creating card:', error);
        alert('Er is een fout opgetreden bij het maken van de kaart. Probeer het opnieuw.');

      }


    });

    function generateUniqueIdentifier() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }

    function displayErrors(errors) {
      const errorMessagesContainer = document.getElementById('error-messages');
      errorMessagesContainer.style.display = 'block'; // Show the error messages container
      errorMessagesContainer.innerHTML = ''; // Clear previous error messages

      const errorList = document.createElement('ul'); // Create an unordered list for the error messages

      for (const [key, value] of Object.entries(errors)) {
        const errorMessageItem = document.createElement('li'); // Create a list item for each error message
        if (value == 'Energy requirement must be a non-negative number') {
          errorMessageItem.textContent = 'Energiebehoefte moet een niet-negatief getal zijn.';
        } else if (value == 'Title is required') {
          errorMessageItem.textContent = 'Titel is vereist.';
        } else if (value == 'Description is required') {
          errorMessageItem.textContent = 'Beschrijving is vereist.';
        } else if (value == 'Multiplier must be a positive integer') {
          errorMessageItem.textContent = 'Vermenigvuldiger moet een positief geheel getal zijn.';
        } else if (value == 'Image2 is required') {
          errorMessageItem.textContent = 'Afbeelding2 is vereist.';
        } else {
          errorMessageItem.textContent = value;
        }
        errorList.appendChild(errorMessageItem); // Append each error message to the list
      }

      errorMessagesContainer.appendChild(errorList); // Append the list to the error messages container
    }

  }

  generateHtml() {
    const container = document.querySelector('.card-container');

    container.innerHTML = '';

    this.cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.style.marginTop = '0';

      const batteryElement = document.createElement('b');
      batteryElement.className = 'chargable-card';
      batteryElement.textContent = this.energy >= card.energyRequirement ? '🔋' : '🪫';
      cardElement.appendChild(batteryElement);

      const titleElement = document.createElement('h2');
      titleElement.textContent = card.title;
      cardElement.appendChild(titleElement);

      const descriptionElement = document.createElement('p');
      descriptionElement.innerHTML = card.description;
      cardElement.appendChild(descriptionElement);

      const flexContainerElement = document.createElement('div');
      flexContainerElement.className = 'flex-center-container';

      const multiplierElement = document.createElement('p');
      multiplierElement.className = 'multiplier';
      multiplierElement.textContent = `${card.multiplier} X`;
      flexContainerElement.appendChild(multiplierElement);

      const image1Element = document.createElement('img');
      image1Element.src = card.image1;
      image1Element.alt = `${card.title} Image 1`;
      image1Element.className = 'solarpanel';
      flexContainerElement.appendChild(image1Element);

      const equalsElement = document.createElement('p');
      equalsElement.className = 'equals';
      equalsElement.textContent = '=' + (card.poweredDevice || '');
      flexContainerElement.appendChild(equalsElement);

      const image2Element = document.createElement('img');
      image2Element.src = `/backend/${card.image2}`;
      image2Element.alt = `${card.title} Image 2`;
      image2Element.className = 'solarpanel';
      flexContainerElement.appendChild(image2Element);

      cardElement.appendChild(flexContainerElement);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add(`delete-button-${card.id}`);
      cardElement.appendChild(deleteButton);

      deleteButton.addEventListener('click', async () => {
        if (confirm(`Weet je zeker dat je de kaart "${card.title}" wilt verwijderen?`)) {
          await CardService.deleteCard(card.id);
          this.cards = await CardService.fetchAllCards();
          this.generateHtml();
        }
      });

      container.appendChild(cardElement);
    });


  }



}

customElements.define('energy-voorwerp-overview', EnergyVoorwerpOverview);
