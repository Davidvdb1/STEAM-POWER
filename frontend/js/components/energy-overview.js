import ClassroomService from "../../service/classroom.service.js";
import SPAComponent from "./model/SPAComponent.js";
import formatNumberBelgianStyle from "../../js/utils/number-converter.js";

class EnergyOverview extends SPAComponent {
  constructor() {
    super();
    this.classRooms = [];

    this.polling = async () => {
      this.classRooms = await ClassroomService.getAll();
      if (this.classRooms.length > 0) {
        this.generateTableHtml();
      }
    }
    this.polling()
    this.registerInterval(5000, this.polling);

    this.energy = 0.00;
    this.fetchEnergy = (value) => {
      if (this.energy != value) {
        this.energy = value;
        if (this.classRooms.length > 0) {
          this.generateTableHtml();
        }
      }
      this.energy = value;
    }

    classroomEnergyObserver.setFetchEnergy(ClassroomService.fetchClassroomById);
    classroomEnergyObserver.subscribe({ name: 'energy-overview-fetchEnergy', cb: this.fetchEnergy });
  }

  connectedCallback() {
    if (this.classRooms.length > 0) {
      this.generateTableHtml();
    }
    this.polling();
  }

  generateTableHtml() {
    const currentGroup = sessionStorage.getItem('currentGroup');
    const groupId = currentGroup ? JSON.parse(currentGroup).id : null;

    let table = `<div class="table-responsive">
                  <table class="table table-striped">
                    <tr>
                      <th>Groep Naam</th>
                      <th>Opgeleverde Energie (Watt-seconden)</th>
                    </tr>`;
    this.classRooms.forEach((item) => {
      let rowClass = item.id === groupId ? 'marked' : '';

      table += `<tr class="${rowClass}">
                  <td class="${rowClass}-cell">
                    ${item.name}
                    <span style="margin-left: 1rem; font-weight: normal">${rowClass ? '(Jouw groep)' : ''}</span>
                  </td>
                  <td class="${rowClass}-cell">
                      ${rowClass ? formatNumberBelgianStyle(this.energy) : formatNumberBelgianStyle(item.energy_watt)}
                  </td>
                </tr>`;
    });

    table += '</table></div>';

    this.innerHTML = `
        ${table}
    `;
  }
}

customElements.define('energy-overview', EnergyOverview);
