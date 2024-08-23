import WorkshopService from "../../../service/workshop.service.js";
import CampService from "../../../service/camp.service.js";

class WorkshopDetailsPage extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const campId = sessionStorage.getItem('selectedCamp');
        let res = await CampService.fetchCampById(campId);
        this.camp = await res.json();
        this.renderCamp();

        const workshopId = sessionStorage.getItem('selectedWorkshop');
        res = await WorkshopService.fetchWorkshopById(workshopId);
        this.workshop = await res.json();
        this.renderWorkshop();
    }

    renderCamp() {
        let content = `
            <div style="height: 100%;">
                <h5 style="text-align: center; margin-bottom: 1.5rem;">Kamp ${this.camp.title}</h5>
                <div id="workshop-container" class="loading-active">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        this.innerHTML = content;
    }

    renderWorkshop() {
        document.getElementById('content-container').style = 'height: 100%;';

        let content = `
            <article class="centered-content" style="height: calc(100% - 3rem);">
                <h3>${this.workshop.name}</h3>
        `;

        let currentUl = '';

        this.workshop.components.forEach((component, index) => {
            if (component.type === 'titel') {
                if (currentUl) {
                    content += '</ul>';
                    currentUl = '';
                }
                content += `<h4>${component.content.text}</h4>`;
            } else if (component.type === 'subtitel') {
                if (currentUl) {
                    content += '</ul>';
                    currentUl = '';
                }
                content += `<h5>${component.content.text}</h5>`;
            } else if (component.type === 'tekst') {
                if (currentUl) {
                    content += '</ul>';
                    currentUl = '';
                }
                content += `<p>${component.content.text}</p>`;
            } else if (component.type === 'stappen') {
                if (!currentUl) {
                    content += '<ul>';
                    currentUl = 'open';
                }
                content += `<li>${component.content.text}</li>`;
            } else if (component.type === 'link') {
                if (!currentUl) {
                    content += '<ul>';
                    currentUl = 'open';
                }
                content += `<li><a href="${component.content.url}" style="word-break: break-all;">${component.content.url}</a></li>`;
            } else if (component.type === 'afbeelding') {
                if (currentUl) {
                    content += '</ul>';
                    currentUl = '';
                }
                if (component.content.isUrl !== 'true') {
                    content += `<img src="data:image/jpeg;base64,${component.content.data}" alt="Workshop Image" class="img-scale" style="margin-top: 1rem;">`;
                } else {
                    content += `<img src="${component.content.path}" alt="Workshop Image" class="img-scale" style="margin-top: 1rem;">`;
                }
            }
        });

        if (currentUl) {
            content += '</ul>';
            currentUl = '';
        }
        content += `</article>`;

        const parentNode = document.getElementById('workshop-container')
        parentNode.innerHTML = content;
        parentNode.classList.remove('loading-active');

        // Call the function to adjust image sizes
        this.adjustImageSizes();
    }

    // Function to adjust image sizes
    adjustImageSizes() {
        const images = this.querySelectorAll('.workshop-image');
        images.forEach(image => {
            image.onload = () => {
                if (image.naturalWidth > image.naturalHeight) {
                    image.classList += 'img-scale';
                } else {
                    image.classList = '.img-scale-revert';
                }
            };
        });
    }
}

customElements.define("workshop-details-page", WorkshopDetailsPage);
