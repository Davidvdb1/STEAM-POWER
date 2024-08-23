import ClassroomService from "../../service/classroom.service.js";
import SPAComponent from "./model/SPAComponent.js";
import MicrobitLogService from "../../service/microbitLog.service.js";
var dataValues = [];


class DataOverview extends SPAComponent {
  constructor() {
    super();
    this.errorBluetooth = false;
    this.errorHTTP = false;
    this.statusMessageBluetooth = '';
    this.statusMessageHTTP = '';

    window.microBitHandler.subscribe({
      name: 'increaseEnergy', cb: (value) => {
        if (value === '\n') return;
        dataValues.push(value);
        this.updateData();
        // send to back-end
        ClassroomService.increaseEnergy(value).then(r => {
          const genLabel = document.getElementById('currently-generating');
          if (genLabel) {
            genLabel.innerText = `U = ${Math.round(parseFloat(r.U) * 100.0) / 100.0}V`;
          }
        });
      }
    });
  }


  addStatusMessageBluetooth(msg, error) {
    this.statusMessageBluetooth = msg;
    this.errorBluetooth = error;
    this.updateStatusBluetooth();
  }

  addStatusMessageHTTP(msg, error) {
    this.statusMessageHTTP = msg;
    this.errorHTTP = error;
    this.updateStatusHTTP();
  }

  generateHtml() {
    this.innerHTML = `
      <div class="connection_container">
        <button id="connect-bluetooth" class="btn btn-primary mb-2">
          Connecteer via Bluetooth📶
        </button>
        <div id="status-field-bluetooth"></div>

        <button id="connect-http" class="btn btn-primary mb-2">
          Connecteer via HTTP📶
        </button>
        <div id="status-field-http"></div>

        <p><b>Lezing: </b><div id="currently-generating">U = 0V</div></p>
        <textarea readonly id="data" class="mt-3"></textarea>
      </div>

      <style>
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
            color: white;
            width: 60%;
            height: 30%;
            overflow: auto;
        }

        .custom-modal.active {
            display: block;
        }
        .file-button {
            padding: 10px;
            border-radius: 10px;
            margin-right: 3px;
        }

        #data {
            resize: none;
            overflow: auto;
            width: 50%;
            height: 10em;
        }
        </style>
    `;
  }

  updateStatusBluetooth() {
    document.getElementById("status-field-bluetooth").innerHTML = `
      <div id="status" class="${this.errorBluetooth ? 'status_error' : 'status_success'}">
        ${this.statusMessageBluetooth}
      </div>
    `;
  }

  updateStatusHTTP() {
    document.getElementById("status-field-http").innerHTML = `
      <div id="status" class="${this.errorHTTP ? 'status_error' : 'status_success'}">
        ${this.statusMessageHTTP}
      </div>
    `;
  }

  clearStatusMessages() {
    document.getElementById("status-field-bluetooth").innerHTML = '';
    document.getElementById("status-field-http").innerHTML = '';
  }

  updateData() {
    const dataTable = document.getElementById('data');
    if (dataTable) {
      let table = '';
      dataValues.forEach((element) => table += element + '\n');
      dataTable.value = table;
    }
  }

  connectedCallback() {
    this.generateHtml();

    this.initEventListeners();
  }

  initEventListeners() {
    this.registerEventListener(document.getElementById("connect-bluetooth"), "click", this.handleConnectBluetooth);
    this.registerEventListener(document.getElementById("connect-http"), "click", this.handleConnectHTTP);
  }

  handleConnectBluetooth = async () => {
    try {
      this.clearStatusMessages();
      await microBitHandler.startBluetooth();
      this.addStatusMessageBluetooth('Connectie gemaakt met de Micro:bit', false);
    } catch (e) {
      console.log('error: ', e);
      this.addStatusMessageBluetooth('Connectie mislukt met de Micro:bit', true);
    }
  }

  handleConnectHTTP = async () => {
    this.clearStatusMessages();
    const httpConnection = new Promise(async (resolve, reject) => {
      const files = await MicrobitLogService.getFiles();
      resolve(files);
    });

    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Connection Timeout'));
      }, 2000);
    });

    // if connection is made before the 2s timeout open the modal for the files from the http connection
    // otherwise show connection error
    Promise.race([httpConnection, timeout])
      .then((value) => {
        this.createModal(value);
      })
      .catch((error) => {
        this.addStatusMessageHTTP('Connectie met de HTTP server mislukt', true);
      });
  }

  createModal(files) {
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) return;

    const modal = document.createElement('div');
    modal.classList.add('custom-modal');

    const content = document.createElement('div');

    const title = document.createElement('p');
    title.textContent = 'Selecteer een Bestand';

    const fileContainer = document.createElement('div');

    files.forEach((file) => {

      let button = document.createElement('button');
      button.textContent = file.name;
      button.classList.add('file-button');

      button.onclick = () => {
        this.selectFileName(file.name);
        modal.remove();
        this.addStatusMessageHTTP('Connectie met de HTTP server is gelukt', false);
      };

      fileContainer.appendChild(button);
    });

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';

    this.registerEventListener(closeButton, 'click', () => {
      modal.remove();
    });

    content.appendChild(title);
    content.appendChild(fileContainer);
    content.appendChild(closeButton);
    modal.appendChild(content);

    this.appendChild(modal);
  }

  selectFileName(name) {
    window.microBitHandler.startHTTPFileReading(name);
  }
}

customElements.define('data-overview', DataOverview);
