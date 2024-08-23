import ClassroomService from "../../service/classroom.service.js";
import SPAComponent from "./model/SPAComponent.js";
import formatNumberBelgianStyle from "../../js/utils/number-converter.js";

const MAX_ENERGY = 500;

class Battery extends SPAComponent {
  constructor() {
    super();
    this.filled = 0.00;
    this.energy = 0.00;

    this.batteryImg = new Image();
    this.fullBatteryImg = new Image();

    this.renderBattery = () => {
      const canvas = document.getElementById('battery-canvas');
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(this.batteryImg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.fullBatteryImg, 0, 0, this.fullBatteryImg.width * this.filled, this.fullBatteryImg.height, 0, 0,
        canvas.width * this.filled, canvas.height);

      // Set the font
      if (this.energy < 10000) {
        ctx.font = "30px Arial";
      } else {
        ctx.font = "20px Arial";
      }

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw energy
      ctx.fillText(`${formatNumberBelgianStyle(this.energy)} Ws`, canvas.width / 2, canvas.height / 2);
    }

    // manually fetch the energy without the observer
    this.forceFetchEnergy = async () => {
      const response = await ClassroomService.fetchClassroomById();
      if (response && response.status === 200) {
        const data = await response.json();
        this.energy = data.energy_watt;
        this.filled = Math.min(this.energy / MAX_ENERGY, 1.00);
        this.renderBattery();
      }
    }

    // Callback for the observer
    this.fetchEnergy = async (value) => {
      this.energy = value;
      this.filled = Math.min(this.energy / MAX_ENERGY, 1.00);
      this.renderBattery();
    }

    this.batteryImg.onload = () => {
      this.renderBattery();
    };
    this.batteryImg.src = "img/empty-battery.png";


    this.fullBatteryImg.onload = () => {
      this.renderBattery();
    };
    this.fullBatteryImg.src = "img/full-battery.png";

    classroomEnergyObserver.setFetchEnergy(ClassroomService.fetchClassroomById);
    classroomEnergyObserver.subscribe({ name: 'battery-fetchEnergy', cb: this.fetchEnergy });
  }

  connectedCallback() {
    this.innerHTML = `
        <canvas id="battery-canvas" width="256" height="256"></canvas>
    `;
    setTimeout(async () => {
      await this.forceFetchEnergy();
      await this.renderBattery();
    })

  }
}

customElements.define("battery-view", Battery);
