import SPAComponent from "../model/SPAComponent.js";
import BuildingService from "../../../service/building.service.js";

class SpelPage extends SPAComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    const currentToken = sessionStorage.getItem('token');

    document.getElementsByTagName('main')[0].style = 'margin: 0;';

    this.innerHTML = `
      <div id="main-content">
        <div class="details-container">
          <your-details></your-details>
        </div>
        <div class="my-city-container">
          <my-city-canvas></my-city-canvas>
        </div>
        <div class="details-container" style="margin-top: 1rem">
        ${currentToken ?
        '<custom-slider id="1" ></custom-slider>' : ''}
          <leader-board></leader-board>
        </div>
        <building-table></building-table>
      </div>`;

    const teacherToken = sessionStorage.getItem('token');

    if (teacherToken) {
      const customSlider = document.querySelector('custom-slider');
      this.registerEventListener(customSlider.shadowRoot.getElementById('slider'), 'change', async () => {
        const canvas = document.querySelector('my-city-canvas');
        canvas.updateBuildingCost(await BuildingService.fetchAllBuildings());
      });
    }
  }
}

customElements.define("spel-page", SpelPage);
