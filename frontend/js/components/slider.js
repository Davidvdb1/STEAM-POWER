import sliderService from "../../service/slider.service.js";

class CustomSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .slider-container {
                    width: 50%;
                    margin: 0 0 1rem 0;
                    padding: 1rem;
                    border: black 1px solid;
                    border-radius: 1rem;
                }
                input[type="range"] {
                    width: 100%;
                }
            </style>
            <div class="slider-container">
                <p style="margin: 0 0 0.5rem 0">Kies een schaalwaarde voor de gebouwenkost:</p>
                <input type="range" min="0" max="100" value="50" id="slider">
                <p style="margin: 0">Waarde: <span id="sliderValue">50</span></p>
            </div>
        `;
    }

    async connectedCallback() {
        this.id = this.getAttribute('id');

        const slider = this.shadowRoot.getElementById('slider');
        const output = this.shadowRoot.getElementById('sliderValue');

        const reponse = await sliderService.getSliderValue(this.id);
        const value = await reponse.json();

        slider.value = value.multiplier;
        output.innerHTML = `${slider.value} %`;

        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = async () => {
            const response = await sliderService.setNewSliderValue(this.id, slider.value);
            if (response.ok) {
                output.innerHTML = `${slider.value} %`;
            }
        };
    }
}

customElements.define('custom-slider', CustomSlider);