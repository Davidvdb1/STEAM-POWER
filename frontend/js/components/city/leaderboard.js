import ClassroomService from "../../../service/classroom.service.js";
import SPAComponent from "../model/SPAComponent.js";
import formatNumberBelgianStyle from "../../../js/utils/number-converter.js";

class LeaderBoard extends SPAComponent {
    constructor() {
        super();
        this.classRooms = [];

        this.polling = async () => {
            const response = await ClassroomService.getLeaderBoard();
            if (response.ok) {
                this.classRooms = await response.json();
            }
            if (this.classRooms.length > 0) {
                this.generateTableHtml();
            }
        }
    }

    connectedCallback() {
        this.polling();
        this.registerInterval(5000, this.polling)
    }

    generateTableHtml() {
        this.innerHTML = `
            <div class="table responsive" style="padding: 1rem; border: black 1px solid; border-radius: 1rem; margin: 0;">
                <h3 style="margin-left: 0.5rem;">Leaderboard</h3>
                <div>
                    <table class="table responsive">
                        <thead class="thead-dark">
                            <tr>
                                <th>Naam</th>
                                <th>Score</th>
                                <th>Overige Energie</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.classRooms.map((item) => `
                                <tr>
                                    <td class="align-middle">${item.name}</td>
                                    <td class="align-middle">${item.score}</td>
                                    <td class="align-middle">${formatNumberBelgianStyle(item.energy_watt)} Watt-seconden</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                <div>
            </div>
        `;
    }
}

customElements.define('leader-board', LeaderBoard);
