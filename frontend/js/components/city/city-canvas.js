import { ErrorEnum } from "../../../types/errorEnum.js";
import BuildingService from "../../../service/building.service.js";
import ClassroomService from "../../../service/classroom.service.js";
import SPAComponent from "../model/SPAComponent.js";

class CityCanvas extends SPAComponent {
  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.backgroundImage = { src: './img/city.jpeg', x: 0, y: 0, coords: [] };
    setTimeout(async () => {
      this.buildings = await BuildingService.fetchAllBuildings();
      this.chargedBuildings = await ClassroomService.getAllChargedBuildings();

      await this.loadImages();
    });

    this.selectedBuilding = null;
    this.canvas_offset_x = 17;

    this.registerEventListener(this.canvas, 'mousemove', this.handleMouseMove);
    this.registerEventListener(this.canvas, 'mouseleave', this.handleMouseLeave);
    this.registerEventListener(this.canvas, 'click', this.handleCanvasClick);
    this.registerEventListener(document.body, 'click', this.handleOutsideClick);
    this.registerEventListener(document.body, 'keydown', this.escapePressed);


    // This function checks if the cost_watt of atleast one building has changed
    const hasDifferentCostWatt = (newBuildings) => {
      this.buildings.forEach((building, index) => {
        if (building.cost_watt !== newBuildings[index].cost_watt) return true;
      });
      return false;
    }

    // This function is called every 5 seconds when this SPAComponent is loaded in
    // It checks if there are any newly charged buildings or if the cost_watt of a building has changed
    // if this is the case it will reload the images to show the correct version of the building
    const polBuildings = async () => {
      const newBuildings = await BuildingService.fetchAllBuildings();
      const newChargedBuildings = await ClassroomService.getAllChargedBuildings();
      if (this.chargedBuildings !== newChargedBuildings || hasDifferentCostWatt(newBuildings)) {
        this.buildings = newBuildings;
        this.chargedBuildings = newChargedBuildings;
        await this.loadImages();
      }
    }

    this.registerInterval(5000, polBuildings);


    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize); // Get the root font size in pixels
    const remInPixels = 5.05 * rootFontSize; // Calculate 40rem in pixels
    this.canvasHeight = window.innerHeight - remInPixels; // Calculate the desired canvas width

    this.registerEventListener(window, 'resize', this.updateCanvasSize);
    this.registerEventListener(window, 'resize', this.updateModalPositions);

    this.updateCanvasSize();

    this.appendChild(this.canvas);
    this.loadStyling();
  }

  updateCanvasSize = () => {
    if (this.canvasHeight + this.canvas_offset_x <= window.innerWidth) {
      this.canvas.width = this.canvasHeight;
      this.canvas.height = this.canvasHeight;
    } else {
      this.canvas.width = window.innerWidth - this.canvas_offset_x;
      this.canvas.height = window.innerWidth - this.canvas_offset_x;
    }

    // scale background
    const img = new Image();
    img.onload = () => {
      this.backgroundImage.scaled_coords = this.scaleCoordinates(this.backgroundImage.coords, img.width, img.height, this.canvas.width, this.canvas.height);
    }
    img.src = this.backgroundImage.src;

    if (this.buildings !== undefined) {
      this.buildings.forEach((building) => {
        const img = new Image();
        img.onload = () => {
          building.image.scaled_coords = this.scaleCoordinates(building.image.coords, img.width, img.height, this.canvas.width, this.canvas.height);
        };
        img.src = building.image.src;
      });
    }

    this.redrawCanvas();
  }

  updateModalPositions() {
    if (this.selectedBuilding) {
      const rect = this.canvas.getBoundingClientRect();
      const offset = this.selectedBuilding.image.modal_offset;
      const modal = document.querySelector('.custom-modal');
      if (this.canvasHeight + this.canvas_offset_x <= window.innerWidth) {
        modal.style.left = `${rect.left + window.scrollX + offset.x}px`;
        modal.style.top = `${rect.top + window.scrollY + offset.y}px`;
      } else {
        // Center the modal in the canvas
        const modalRect = modal.getBoundingClientRect();
        const canvasCenterX = rect.left + window.scrollX + rect.width / 2;
        const canvasCenterY = rect.top + window.scrollY + rect.height / 2;

        modal.style.left = `${canvasCenterX - modalRect.width / 2}px`;
        modal.style.top = `${canvasCenterY - modalRect.height / 2}px`;
      }
    }
  }

  async loadImages() {
    this.ctx.filter = 'none';

    // draw background
    const bg = new Image();
    bg.onload = async () => {
      this.ctx.filter = 'none';
      this.ctx.drawImage(bg, this.backgroundImage.x, this.backgroundImage.y, this.canvas.width, this.canvas.height);
      this.backgroundImage.scaled_coords = this.scaleCoordinates(this.backgroundImage.coords, bg.width, bg.height, this.canvas.width, this.canvas.height);
      this.backgroundImage.img = bg;
    }
    bg.src = this.backgroundImage.src;


    this.buildings.forEach((building) => {
      const img = new Image();
      img.onload = () => {
        // If building is charged then give a green glow, otherwise give blue glow
        if (this.chargedBuildings && this.chargedBuildings.includes(building.id)) {
          this.ctx.filter = 'none';
          building.charged = true;
        } else {
          this.ctx.filter = 'grayscale(100%)';
        }
        this.ctx.drawImage(img, building.image.x, building.image.y, this.canvas.width, this.canvas.height);

        building.image.scaled_coords = this.scaleCoordinates(building.image.coords, img.width, img.height, this.canvas.width, this.canvas.height);
        building.image.img = img;
      };
      img.src = building.image.src;
    });
  }

  handleCanvasClick = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if a building is clicked
    this.buildings.forEach((building) => {

      if (building.image.img && this.isPointInPolygon({ x, y }, building.image.scaled_coords)) {
        if (building.modalOpen) {
          // Close the modal if it is already open
          const existingModal = document.querySelector('.custom-modal');
          if (existingModal) {
            existingModal.remove();
            // Reset the selected building when modal is closed
            this.selectedBuilding.modalOpen = false;
            this.selectedBuilding = null;
          }
        } else {
          // Open modal for the clicked building
          this.openModal(building);
          // reset boolean of old open modal building
          if (this.selectedBuilding !== null) {
            this.selectedBuilding.modalOpen = false;
          }
          // Set the selected building
          this.selectedBuilding = building;
          this.selectedBuilding.modalOpen = true;
          e.stopPropagation();
          // Redraw the canvas to remove the glow effect
          this.redrawCanvas();
        }

      }

    });
  }

  handleOutsideClick = (event) => {
    // Check if the clicked element is not a child of any modal
    if (!event.target.closest('.custom-modal')) {
      this.closeAnyExistingModal();
    }
  }

  escapePressed = (event) => {
    if (event.key === 'Escape') {
      this.closeAnyExistingModal();
    }
  }

  closeAnyExistingModal() {
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
      this.closeModal(existingModal);
    }
  }

  closeModal(modal) {
    modal.remove();
    // Reset the selected building when modal is closed
    this.selectedBuilding.modalOpen = false;
    this.selectedBuilding = null;
    // Redraw the canvas to remove the glow effect
    this.redrawCanvas();
  }

  handleMouseMove = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let hand = false;

    // Render images
    if (this.backgroundImage.img) {
      this.ctx.filter = 'none';
      this.ctx.drawImage(this.backgroundImage.img, this.backgroundImage.x, this.backgroundImage.y, this.canvas.width, this.canvas.height);
    }

    if (this.buildings) {
      this.buildings.forEach((building) => {
        if (building.image.img) {

          const bool1 = this.selectedBuilding !== null && this.selectedBuilding.id == building.id;
          const bool2 = this.isPointInPolygon({ x, y }, building.image.scaled_coords)

          if (bool1 || bool2) {

            // Apply white glow effect if the building is selected or hovered
            if (building.charged) {
              this.ctx.filter = 'drop-shadow(0 0 7px #ffffff)';
            } else {
              this.ctx.filter = 'drop-shadow(0 0 7px #ffffff) grayscale(100%)';
            }
            if (bool2) {
              this.canvas.style.cursor = 'pointer';
              hand = true;
            }

          } else {

            // Apply gray effect by default
            if (building.charged) {
              this.ctx.filter = 'none';
            } else {
              this.ctx.filter = 'grayscale(100%)';
            }

          }
          this.ctx.drawImage(building.image.img, building.image.x, building.image.y, this.canvas.width, this.canvas.height);
        }
      });
    }
    if (!hand) {
      this.canvas.style.cursor = 'default';
    }
  }

  handleMouseLeave = () => {
    if (this.buildings) {
      this.buildings.forEach((building) => {
        if (this.selectedBuilding !== null && this.selectedBuilding.id !== building.id) {
          building.modalOpen = false;
        }
      });
    }

    // Redraw canvas to reflect the changes
    this.redrawCanvas();
  }

  redrawCanvas() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render images
    // draw background
    if (this.backgroundImage.img) {
      this.ctx.filter = 'none';
      this.ctx.drawImage(this.backgroundImage.img, this.backgroundImage.x, this.backgroundImage.y, this.canvas.width, this.canvas.height);
    }

    if (this.buildings) {
      this.buildings.forEach((building) => {
        if (building.image.img) {
          if (building.charged) {
            this.ctx.filter = this.selectedBuilding !== null && this.selectedBuilding.id === building.id ? 'drop-shadow(0 0 7px #ffffff)' : 'none';
          } else {
            this.ctx.filter = this.selectedBuilding !== null && this.selectedBuilding.id === building.id ? 'drop-shadow(0 0 7px #ffffff) grayscale(100%)' : 'grayscale(100%)';
          }
          this.ctx.drawImage(building.image.img, building.image.x, building.image.y, this.canvas.width, this.canvas.height);
        }
      });
    }
  }

  openModal(building) {
    // Close any existing modal
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
      this.selectedBuilding.modalOpen = true;
      existingModal.remove();
    }

    // Create and append the new modal
    const modal = building.charged ? this.createChargedModal(building) : this.createModal(building);
    // Calculate position based on canvas coordinates
    let canvas = document.querySelector('my-city-canvas');

    let rect = canvas.getBoundingClientRect();

    const modalX = rect.left + window.scrollX + building.image.modal_offset.x; // X coordinate relative to the canvas
    const modalY = rect.top + window.scrollY + building.image.modal_offset.y; // Y coordinate relative to the canvas
    modal.setAttribute('data-image', building.image.src); // Set a data attribute to identify the image associated with the modal
    const cityCanvas = document.body.querySelector('my-city-canvas');
    cityCanvas.appendChild(modal);

    if (this.canvasHeight + this.canvas_offset_x <= window.innerWidth) {
      // Position the modal relative to the canvas
      modal.style.left = `${modalX}px`;
      modal.style.top = `${modalY}px`;
    } else {
      // Center the modal in the canvas
      const modalRect = modal.getBoundingClientRect();
      const canvasCenterX = rect.left + window.scrollX + rect.width / 2;
      const canvasCenterY = rect.top + window.scrollY + rect.height / 2;

      modal.style.left = `${canvasCenterX - modalRect.width / 2}px`;
      modal.style.top = `${canvasCenterY - modalRect.height / 2}px`;
    }
  }

  loadStyling() {
    const style = document.createElement('style');
    style.innerHTML = `
            .start {
                background-color: #4CAF50; /* Green background */
                border: none; /* No border */
                border-radius: 5px; /* Rounded corners */
                color: white; /* White text */
                text-align: center; /* Centered text */
                text-decoration: none; /* No underline */
                display: inline-block;
                font-size: 16px;
                cursor: pointer; /* Pointer cursor on hover */
                transition-duration: 0.4s; /* Transition */
                padding: 5px 0;
                width: 99.9%;
            }

            .start:hover {
                background-color: #45a049; /* Darker green on hover */
            }

            .left-corner {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                filter: drop-shadow(0 0 7px #0000ff);
            }

            .left-corner-hover {
                filter: drop-shadow(0 0 7px #ffffff);
            }

            .close-button {
                color: white;
                position: absolute;
                top: 0;
                right: 0;
                border: none;
                background: none;
                font-size: 20px;
                cursor: pointer;
                font-size: 15px;
            }

            .custom-modal {
                display: block;
                position: absolute;
                background-color: rgb(47, 42, 47);
                border: 2px solid black;
                border-radius: 10px;
                border-color: rgb(64, 58, 68);
                padding: 10px;
                z-index: 10;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                width: 200px;
                height: fit-content;
                color: white;
            }

            .custom-modal.active {
                display: block;
            }
        `;

    document.head.appendChild(style);
  }

  scaleCoordinates(coords, originalWidth, originalHeight, newWidth, newHeight) {
    return coords.map(coord => {
      return {
        x: (coord.x / originalWidth) * newWidth,
        y: (coord.y / originalHeight) * newHeight
      };
    });
  }

  createModal(building) {
    const modal = document.createElement('div');
    modal.classList.add('custom-modal');

    const content = document.createElement('div');

    const title = document.createElement('p');
    title.textContent = building.image.title || 'No Title';

    const cost = document.createElement('div');
    cost.classList.add('d-flex', 'flex-row');
    cost.innerHTML = `<p>Kostprijs:&nbsp;</p><div class="d-flex flex-row"><p class="m-0">${building.cost_watt !== null ? building.cost_watt : 'Onbekende kostprijs'} Ws</p></div>`;

    const reward = document.createElement('div');
    reward.classList.add('d-flex', 'flex-row');
    reward.innerHTML = `<p>Beloning:&nbsp;</p><div class="d-flex flex-row"><p class="m-0">${building.reward || 'Onbekende beloning'}&nbsp;</p><img src="./img/coin.png" alt="image of the play city" style="width: 25px; height: 25px; margin: 0 0 1rem 0"></div>`;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';

    this.registerEventListener(closeButton, 'click', () => {
      this.closeModal(modal);
    });

    let startButton;
    if (sessionStorage.getItem('currentGroup') !== null) {
      startButton = document.createElement('button');
      startButton.classList.add('start');
      startButton.textContent = 'Start met laden';
      const yourDetails = document.querySelector('your-details');
      const classroom = yourDetails.getData();
      if (classroom.energy_watt < building.cost_watt) {
        startButton.style.backgroundColor = "gray";
        startButton.style.pointerEvents = "none";
      }

      this.registerEventListener(startButton, 'click', async () => {
        const response = await BuildingService.chargeBuilding(this.selectedBuilding);
        if (response.ok) {
          this.selectedBuilding.charged = true;
          modal.remove();
          this.chargedBuildings.push(this.selectedBuilding.id);
          console.log(this.chargedBuildings);

          // Update your details so that it does not have to wait for the next polling to show the new score, ...
          const yourDetails = document.querySelector('your-details');
          if (yourDetails) {
            const classroom = await response.json();
            yourDetails.setData(classroom);
          }

          // Reset the selected building when modal is closed
          this.selectedBuilding.modalOpen = false;
          this.selectedBuilding = null;
          // Redraw the canvas to remove the glow effect
          this.redrawCanvas();
        } else if (response.status === 500) {
          if (!document.getElementById('charge-status')) {
            const status = document.createElement('div');
            status.classList.add('d-flex', 'flex-row');
            status.id = 'charge-status';

            const responseJson = await response.json();
            if (responseJson.error == 'not enough energy') {
              status.innerHTML = `<p class="m-0">Onvoldoene energie</p>`;
            } else if (responseJson.error == 'this building is already charged') {
              status.innerHTML = `<p class="m-0">Gebouw is al opgeladen</p>`;
            } else {
              status.innerHTML = `<p class="m-0">Opladen mislukt</p>`;
            }

            content.appendChild(status);
          }
        } else {
          if (!document.getElementById('charge-status')) {
            const status = document.createElement('div');
            status.classList.add('d-flex', 'flex-row');
            status.id = 'charge-status';
            status.innerHTML = `<p class="m-0">Opladen mislukt</p>`;
            content.appendChild(status);
          }
        }
      });
    }

    content.appendChild(title);
    content.appendChild(cost);
    content.appendChild(reward);
    content.appendChild(closeButton);
    if (sessionStorage.getItem('currentGroup') !== null) {
      content.appendChild(startButton);
    }
    modal.appendChild(content);

    return modal;
  }

  createChargedModal(building) {
    const modal = document.createElement('div');
    modal.classList.add('custom-modal');

    const content = document.createElement('div');

    const title = document.createElement('p');
    title.textContent = building.image.title || 'No Title';

    const info = document.createElement('div');
    info.classList.add('d-flex', 'flex-row');
    info.innerHTML = `<p>Dit gebouw is al opgeladen.</p></div>`;


    const cost = document.createElement('div');
    cost.classList.add('d-flex', 'flex-row');
    cost.innerHTML = `<p>Kostprijs:&nbsp;</p><div class="d-flex flex-row"><p class="m-0">${building.cost_watt !== null ? building.cost_watt : 'Onbekende kostprijs'} Watt</p></div>`;

    const reward = document.createElement('div');
    reward.classList.add('d-flex', 'flex-row');
    reward.innerHTML = `<p class="m-0">Beloning:&nbsp;</p><div class="d-flex flex-row"><p class="m-0">${building.reward || 'Onbekende beloning'}&nbsp;</p><img class="m-0" src="./img/coin.png" alt="image of the play city" style="width: 25px; height: 25px"></div>`;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    this.registerEventListener(closeButton, 'click', () => {
      this.closeModal(modal);
    });

    content.appendChild(title);
    content.appendChild(info);
    content.appendChild(cost);
    content.appendChild(reward);
    content.appendChild(closeButton);
    modal.appendChild(content);

    return modal;
  }

  isPointInPolygon(point, vs) {
    let x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].x, yi = vs[i].y;
      let xj = vs[j].x, yj = vs[j].y;

      let intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  updateBuildingCost(newBuildings) {
    for (let i = 0; i < this.buildings.length; i++) {
      this.buildings[i].cost_watt = newBuildings[i].cost_watt;
    }
  }
}

customElements.define('my-city-canvas', CityCanvas);
