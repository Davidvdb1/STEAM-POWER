import CampService from "../../service/camp.service.js";
import workshopService from "../../service/workshop.service.js";
import SPAComponent from "./model/SPAComponent.js";

class DropDown extends SPAComponent {
    constructor() {
        super();
        this.workshops = [];
        this.isOpen = false;
        this.originalState = {}; // Object to store the original state of checkboxes
        this.changes = {}; // Object to track changes
    }

    async connectedCallback() {
        // Fetch workshops from workshopService
        const response = await workshopService.fetchAllWorkshopsIdAndName();
        this.workshops = await response.json();

        let relations = [];
        const storedCampId = sessionStorage.getItem('campToUpdate');
        if (storedCampId) {
            // Fetch initial relations from CampService
            const responseRelations = await CampService.fetchRelationsForCamp(storedCampId);
            relations = await responseRelations.json();
        }

        // Store the original state of checkboxes
        this.workshops.forEach(workshop => {
            const isChecked = relations.some(relation => relation.workshop_id === workshop.id);
            workshop.checked = isChecked;
            this.originalState[workshop.id] = isChecked;
        });

        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add event listener to checkboxes to update the checked state and track changes
        this.querySelectorAll('.form-check-input').forEach(checkbox => {
            this.registerEventListener(checkbox, 'change', () => {
                const workshopId = parseInt(checkbox.value);
                const workshop = this.workshops.find(workshop => workshop.id === workshopId);
                if (workshop) {
                    workshop.checked = checkbox.checked;
                    if (checkbox.checked !== this.originalState[workshopId]) {
                        this.changes[workshopId] = checkbox.checked; // Track the change
                    } else {
                        delete this.changes[workshopId]; // Remove the change if it's back to the original state
                    }
                }
            });
        });

        // Add event listener to the search input
        const searchInput = this.querySelector('.form-control');
        if (searchInput) {
            this.registerEventListener(searchInput, 'input', () => this.searchAndUpdate());
        }

        // Reinitialize the dropdown behavior after rendering
        if (window.bootstrap && window.bootstrap.Dropdown) {
            const dropdownElement = this.querySelector('.dropdown-toggle');
            if (dropdownElement) {
                new bootstrap.Dropdown(dropdownElement);
            }
        }
    }

    getData() {
        // Return the changes
        return this.changes;
    }

    async searchAndUpdate() {
        const searchValue = this.querySelector('.form-control').value;
        const filteredWorkshops = this.workshops.filter(workshop => workshop.name.toLowerCase().includes(searchValue.toLowerCase()));
        const newEntries = filteredWorkshops.map(workshop => `
            <li>
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${workshop.id}" id="workshop${workshop.id}" ${workshop.checked ? 'checked' : ''} />
                        <label class="form-check-label" for="workshop${workshop.id}">${workshop.name}</label>
                    </div>
                </a>
            </li>
        `).join('');
        const entriesElements = document.getElementsByClassName('entries');
        for (let i = 0; i < entriesElements.length; i++) {
            entriesElements[i].innerHTML = newEntries;
        }
    }

    render(workshops = this.workshops) {
        // Generate HTML for dropdown menu items
        let workshopItems = `<ul class="entries" style="padding: 0;">`;
        workshopItems += workshops.map(workshop => `
            <li>
                <a class="dropdown-item" href="#">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${workshop.id}" id="workshop${workshop.id}" ${workshop.checked ? 'checked' : ''} />
                        <label class="form-check-label" for="workshop${workshop.id}">${workshop.name}</label>
                    </div>
                </a>
            </li>
        `).join('');
        workshopItems += `</ul>`;

        // Set inner HTML of dropdown
        this.innerHTML = `

            <div class="dropdown" style="display: block; position: static !important; margin-bottom: 1rem; box-shadow: none;">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-expanded="false">
                    Selecteer workshops
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li>
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1">
                        </div>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    ${workshopItems}
                </ul>
            </div>
        `;

        // Re-setup event listeners after re-rendering
        this.setupEventListeners();
    }
}

customElements.define("dropdown-component", DropDown);
