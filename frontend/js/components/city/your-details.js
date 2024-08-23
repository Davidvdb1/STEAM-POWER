import ClassroomService from "../../../service/classroom.service.js";
import SPAComponent from "../model/SPAComponent.js";
import formatNumberBelgianStyle from "../../../js/utils/number-converter.js";

class YourDetails extends SPAComponent {
    constructor() {
        super();
        this.classRoom = null;

        this.polling = async () => {
            const response = await ClassroomService.fetchClassroomById();
            if (response.ok) {
                this.classRoom = await response.json();
            }
            this.generateTableHtml();
        }
    }

    connectedCallback() {
        const currentGroup = sessionStorage.getItem('currentGroup');
        if (currentGroup) {
            this.polling();
            this.registerInterval(5000, this.polling);
        }
    }

    getData() {
        return this.classRoom;
    }

    setData(classRoom) {
        this.classRoom = classRoom;
        this.generateTableHtml();
    }

    generateTableHtml() {
        this.innerHTML = `
            <div class="table responsive" style="padding: 1rem; border: black 1px solid; border-radius: 1rem;">
                <h3 style="margin-left: 0.5rem;">Jouw statistiek:</h3>
                <div>
                    <table class="table responsive">
                        <thead class="thead-dark">
                            <tr>
                                <th>Omschrijving</th>
                                <th>Waarde</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="align-middle">Beschikbare energie:</td>
                                <td class="align-middle"> ${formatNumberBelgianStyle(Math.round(this.classRoom.energy_watt * 100.0) / 100.0)} Watt-seconden</td>
                            </tr>
                            <tr>
                                <td class="align-middle">Score:</td>
                                <td class="align-middle">
                                    <div style="display: flex; align-items: center;">
                                        ${this.classRoom.score} <img src="./img/coin.png" alt="Coin" style="width: 25px; height: 25px; margin: 0">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
}

customElements.define('your-details', YourDetails);
