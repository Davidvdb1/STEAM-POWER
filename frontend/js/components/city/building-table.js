import SPAComponent from "../model/SPAComponent.js";
import BuildingService from "../../../service/building.service.js";

class BuildingTable extends SPAComponent {
  constructor() {
    super();
    this.buildings = [];
  }

  async fetchBuildings() {
    this.buildings = await BuildingService.fetchAllBuildings();
  }

  generateHtml() {
    const table = document.createElement('table');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['ID', 'Name', 'Cost Watt', 'Reward', 'Image'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    this.buildings.forEach(building => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = building.id;
      row.appendChild(idCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = building.name;
      row.appendChild(nameCell);

      const costWattCell = document.createElement('td');
      costWattCell.textContent = building.cost_watt;
      row.appendChild(costWattCell);

      const rewardCell = document.createElement('td');
      rewardCell.textContent = building.reward;
      row.appendChild(rewardCell);

      // const imageCell = document.createElement('td');
      // const image = document.createElement('img');
      // image.src = building.image.src;
      // imageCell.appendChild(image);
      // row.appendChild(imageCell);

      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.id = `delete-button-${building.id}`;
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the BuildingTable element
    this.appendChild(table);

    // Add event listener to delete buttons
  }

  generateForm() {
    const formHtml = `
    <form id="addBuildingForm">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="cost_watt">Cost Watt:</label>
      <input type="number" id="cost_watt" name="cost_watt" required>

      <label for="reward">Reward:</label>
      <input type="number" id="reward" name="reward" required>

      <label for="image_coords">Image Coords:</label>
      <input type="text" id="image_coords" name="image_coords" required>

      <label for="image_modal_offset_x">Image Modal Offset X:</label>
      <input type="number" id="image_modal_offset_x" name="image_modal_offset_x" required>

      <label for="image_modal_offset_y">Image Modal Offset Y:</label>
      <input type="number" id="image_modal_offset_y" name="image_modal_offset_y" required>

      <label for="image_file">Image File:</label>
      <input type="file" id="image_file" name="image_file" required>

      <button type="submit">Add Building</button>
    </form>
  `;

    // Append the form to the BuildingTable element
    this.innerHTML += formHtml;
  }

  async connectedCallback() {
    await this.fetchBuildings();
    this.generateHtml();
    this.generateForm();

    this.querySelector('#addBuildingForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);

      // Format the coords string into an array of objects
      const coordsString = formData.get('image_coords');
      const coordsArray = coordsString.split(',').map(Number);
      const formattedCoords = [];
      for (let i = 0; i < coordsArray.length; i += 2) {
        formattedCoords.push({ x: coordsArray[i], y: coordsArray[i + 1] });
      }

      // Create the image JSON object
      const image = {
        x: 0,
        y: 0,
        src: '',
        title: formData.get('name'),
        modalOpen: false,
        modal_offset: {
          x: Number(formData.get('image_modal_offset_x')),
          y: Number(formData.get('image_modal_offset_y'))
        },
        coords: formattedCoords
      };

      // Get the file from the 'image_file' field and add it to the form data
      const fileElement = document.getElementById('image_file');
      if (fileElement.files[0]) {
        const file = fileElement.files[0];
        formData.append('files', file);
      }

      // Create the buildingData JSON
      const buildingData = {
        id: formData.get('id'),
        name: formData.get('name'),
        cost_watt: formData.get('cost_watt'),
        reward: formData.get('reward'),
        image: JSON.stringify(image) // Stringify the image JSON object
      };

      // Add the buildingData JSON to the form data
      formData.set('buildingData', JSON.stringify(buildingData));

      // Log the form data for inspection
      for (let [name, value] of formData) {
        console.log(`${name}: ${value}`);
      }

      // Log the JSON sent to the backend
      console.log('buildingData JSON sent to the backend:', formData.get('buildingData'));
      console.log('image JSON sent to the backend:', formData.get('image'));

      // Call BuildingService.createBuilding(formData) to send the data to the server
      try {
        const response = await BuildingService.createBuilding(formData);
        if (response.ok) {
          console.log('Building added successfully');
        } else {
          console.error('Failed to add building');
        }
      } catch (error) {
        console.error('Error adding building:', error);
      }
    });

    this.buildings.forEach(building => {
      const deleteButton = this.querySelector(`#delete-button-${building.id}`);
      deleteButton.addEventListener('click', async () => {
        if (confirm(`Weet je zeker dat je het gebouw "${building.name}" wilt verwijderen?`)) {
          await BuildingService.deleteBuilding(building.id);
        }
      });
    });
  }
}

customElements.define('building-table', BuildingTable);
