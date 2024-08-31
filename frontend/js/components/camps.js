import CampService from "../../service/camp.service.js";
import SPAComponent from "./model/SPAComponent.js";

class Camps extends SPAComponent {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = `
            <div class="loading-active">
                <h2>Kampen</h2>
                <div class="spinner"></div>
            </div>
        `;
        const searchCriteria = {}; // Initialize an empty search criteria object
        await this.renderCamps(null, searchCriteria);
    }

    async renderCamps(camps = null, searchCriteria = {}) {

        // Fetch the camp data from the backend if not provided
        if (!camps) {
            const response = await CampService.fetchAllcamps();
            camps = await response.json();
        }

        console.log('Camps data:', camps);

        const token = sessionStorage.getItem("token");

        // Get the current sort option
        const sortCriteria = this.querySelector("#sort-dropdown")?.value || "";

        // Get the current search and filter criteria
        const { title = "", location = "", age = "", startDate = "", endDate = "" } = searchCriteria;

        // Dynamically create HTML content based on fetched data
        let content = `
        <h2>Kampen</h2>
        <div class="search-sort-container">
            <div class="search-row">
                <input type="text" id="search-bar" placeholder="Zoek kampen op titel" value="${title}">
                <input type="text" id="location-filter" placeholder="Filter op locatie" value="${location}">
                <input type="number" id="age-filter" placeholder="Filter op leeftijd" value="${age}">
            </div>
            <div class="filter-row">
                <label for="start-date-filter">Van:</label>
                <input type="date" id="start-date-filter" value="${startDate}">
                <label for="end-date-filter">Tot:</label>
                <input type="date" id="end-date-filter" value="${endDate}">
                <button id="search-button">Zoeken</button>
                <button id="reset-button">Reset</button>
            </div>
            <div class="sort-row">
                <select id="sort-dropdown">
                    <option value="" ${sortCriteria === "" ? "selected" : ""}>Geen sortering</option>
                    <option value="name" ${sortCriteria === "name" ? "selected" : ""}>Sorteer op titel</option>
                    <option value="date" ${sortCriteria === "date" ? "selected" : ""}>Sorteer op datum</option>
                </select>
            </div>
        </div>
        <div class="planning-container">
    `;

        if (!searchCriteria.title && !searchCriteria.location && !searchCriteria.age && !searchCriteria.startDate && !searchCriteria.endDate) {
            // If no search criteria provided, show default message
            if (camps.length === 0) {
                content += `
                <p style="text-align: center; font-weight: bold;">Er zijn nog geen kampen toegevoegd<br>
                door de leerkracht(en).</p>
            `;
            }
        } else {
            // If search criteria provided but no camps found, display "No camps found" message
            if (camps.length === 0) {
                content += `
                <p style="text-align: center; font-weight: bold;">Geen kampen gevonden.</p>
            `;
            }
        }
        camps.forEach((camp, index) => {
            // Calculate the duration of the camp
            const startDateTime = new Date(camp.startDate);
            const endDateTime = new Date(camp.endDate);
            const startTimeParts = camp.startTime.split(":");
            const endTimeParts = camp.endTime.split(":");

            const formattedStartTime = `${startTimeParts[0]}u${startTimeParts[1]}`;
            const formattedEndTime = `${endTimeParts[0]}u${endTimeParts[1]}`;

            const formattedStartDate = startDateTime.toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const formattedEndDate = endDateTime.toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            const durationString = `van ${formattedStartDate} om ${formattedStartTime} tot ${formattedEndDate} om ${formattedEndTime}`;

            content += `
                <article class="article" style="padding: 0; display: flex; flex-direction: column; height: 100%;">

                    <style>
                        .camp-image {
                            width: 100%;
                            height: 200px; /* Adjust this height as needed */
                            object-fit: cover;
                            margin: 0;
                        }
                    </style>

                    ${!camp.content.isUrl && camp.content.data ?
                    // Display the image using base64-encoded data with scaled width
                    `<img src="data:image/jpeg;base64,${camp.content.data}" alt="Workshop Image" class="camp-image">`
                    : ``}
                    ${camp.content.isUrl == true ?
                    // Display the image using a URL with scaled width
                    `<img src="${camp.content.path}" alt="Workshop Image" class="camp-image">`
                    : ``}
                    ${!camp.content.isUrl && !camp.content.data ?
                    // Display the image using a URL with scaled width
                    `<img src="https://api.ledenbeheer.be/?q=render_preview&club=1727650&fid=783520&format=350x250" alt="Workshop Image" class="camp-image">`
                    : ``}
                    <div style="padding: 1rem; flex-grow: 1;">
                        <div style="margin-bottom: 1rem">
                            <h3 style="width: calc(100% - 2rem); color: #3d5365; text-decoration: none; font-weight: 600; font-size: 1.2rem; margin-bottom: 1rem;">${camp.title
                }</h3>

                            <span style="color: gray">
                                ${new Date(camp.startDate).toLocaleDateString(
                    "nl-NL",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }
                )}
                                tot
                                ${new Date(camp.endDate).toLocaleDateString(
                    "nl-NL",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }
                )}
                            </span>
                        </div>

                        <div style="color: #00c292; font-style: italic;">
                            ${durationString}
                        </div>

                        <style>
                            .ul {
                                list-style: none;
                            }
                            .ul li {
                                line-height: 1;
                            }
                            .ul li::before {
                                line-height: 1;
                                content: "• ";
                                color: rgb(235, 155, 126);
                                display: inline-block;
                                width: 1em;
                                margin-left: -1em;
                                font-size: 1.75em;
                            }

                            .ul li:nth-child(even)::before {
                                color: rgb(56, 175, 226);
                            }

                        </style>
                        <ul class="ul">
                            <li>${camp.startAge} t.e.m ${camp.endAge} jaar</li>
                            <li>${camp.location}</li>
                        </ul>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: auto; margin-bottom: 1rem; margin-right: 1rem;">
                        <style>
                            .more-info {
                                border-color: #38afe2;
                                color: #38afe2;
                                align-items: center;
                                background: white;
                                padding: .6rem 1rem;
                                border-radius: 5px;
                                display: inline-flex;
                                font-weight: 600;
                                outline: 0;
                                text-transform: uppercase;
                                cursor: pointer;
                                transition: .3s ease-in-out;
                                font-size: 1rem;
                                font-weight: bold;
                                box-shadow: none;
                                border-style: solid;
                            }

                            .more-info:hover {
                                color: #7ecff9; /* Lighter blue */
                                border-color: #7ecff9; /* Lighter blue */
                            }
                        </style>

                        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">

                            <button class="more-info"><span>Meer info</span></button>
                        </div>
                    </div>

                    ${token ? `
                        <label style="position: absolute; right: 45px; top: 16px; color: white; display: flex; text-shadow: 2px 2px 8px black; background-color: rgba(0, 0, 0, 0.5); padding: 5px; border-radius: 5px;">
                            <input style="margin-right: 3px;" type="checkbox" class="archive-checkbox" data-id="${camp.id}" ${camp.archived ? 'checked' : ''}>
                            Archiveer
                        </label>
                        <div class="settings-icon no-select" id="settings-icon-${index}">&#9881;</div>
                        <div class="dropdown" id="dropdown-${index}">
                            <a href="#" class="update" data-id="${camp.id}">Update</a>
                            <a href="#" class="delete" data-id="${camp.id}">Delete</a>
                        </div>`
                    : ""
                }
                </article>
            `;
        });

        if (token) {
            content += `
                <article class="add-workshop" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                    <div style="border: 2px solid; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-weight: bold;">+</div>
                </article>
            `;
        }

        content += `</div>`;

        this.innerHTML = content;

        if (token) {
            // After the camps have been rendered to the DOM
            const checkboxes = document.querySelectorAll('.archive-checkbox');

            checkboxes.forEach(checkbox => {
                this.registerEventListener(checkbox, 'change', async (event) => {
                    event.preventDefault();
                    const campId = event.target.dataset.id;
                    try {
                        const response = await CampService.toggleArchiveForCamp(campId);
                        if (!response.ok) {
                            throw new Error('Failed to toggle archive status');
                        }
                    } catch (error) {
                        console.error('Error toggling archive status:', error);
                    }
                });
            });

            this.registerEventListener(this.querySelector(".add-workshop"), 'click', () => {
                sessionStorage.removeItem("campToUpdate");
                navs.switchView(navs.SAVE_CAMP);
            });

            camps.forEach((camp, index) => {
                const settingsIcon = this.querySelector(`#settings-icon-${index}`);
                const dropdown = this.querySelector(`#dropdown-${index}`);

                this.registerEventListener(settingsIcon, 'click', () => {
                    dropdown.style.display =
                        dropdown.style.display === "block" ? "none" : "block";
                });

                this.registerEventListener(dropdown.querySelector(".update"), 'click', (event) => {
                    event.preventDefault();
                    sessionStorage.setItem('campToUpdate', camp.id);
                    navs.switchView(navs.SAVE_CAMP);
                });

                this.registerEventListener(dropdown.querySelector(".delete"), 'click', async (event) => {
                    event.preventDefault();
                    if (confirm(`Weet je zeker dat je het kamp "${camp.titel}" wilt verwijderen?`)) {
                        await CampService.deleteCamp(camp.id);
                        await this.renderCamps();
                    }
                });

                this.registerEventListener(document, 'click', (event) => {
                    if (!settingsIcon.contains(event.target) && !dropdown.contains(event.target)) {
                        dropdown.style.display = "none";
                    }
                });
            });
        }

        this.querySelectorAll(".more-info").forEach((article, index) => {
            this.registerEventListener(article, 'click', () => {
                sessionStorage.setItem('selectedCamp', camps[index].id);
                navs.switchView(navs.WORKSHOPS);
            });
        });

        this.registerEventListener(this.querySelector("#search-button"), 'click', async () => {
            await this.searchAndRenderCamps();
        });

        this.registerEventListener(this.querySelector("#reset-button"), 'click', async () => {
            await this.resetFilters();
        });

        this.registerEventListener(this.querySelector("#sort-dropdown"), 'change', async () => {
            await this.sortAndRenderCamps();
        });

    }

    async searchAndRenderCamps() {
        const title = this.querySelector("#search-bar").value;
        const location = this.querySelector("#location-filter").value;
        const age = this.querySelector("#age-filter").value;
        const startDate = this.querySelector("#start-date-filter").value;
        const endDate = this.querySelector("#end-date-filter").value;
        await this.renderFilteredCamps(title, location, age, startDate, endDate);
    }

    async renderFilteredCamps(title, location, age, startDate, endDate) {
        const searchCriteria = { title, location, age, startDate, endDate };
        const response = await CampService.searchCamps(title, startDate, age, location, endDate);
        const filteredCamps = await response;
        await this.renderCamps(filteredCamps, searchCriteria);
    }

    async sortAndRenderCamps() {
        const sortCriteria = this.querySelector("#sort-dropdown").value;
        const response = await CampService.fetchAllcamps();
        const camps = await response.json();
        const sortedCamps = [...camps];

        sortedCamps.sort((a, b) => {
            if (sortCriteria === "name") {
                return a.title.localeCompare(b.title);
            } else if (sortCriteria === "date") {
                return new Date(a.startDate) - new Date(b.startDate);
            }
        });

        await this.renderCamps(sortedCamps);
    }

    async resetFilters() {
        this.querySelector("#search-bar").value = "";
        this.querySelector("#location-filter").value = "";
        this.querySelector("#age-filter").value = "";
        this.querySelector("#start-date-filter").value = "";
        this.querySelector("#end-date-filter").value = "";
        await this.renderCamps();
    }
}

customElements.define("custom-camps", Camps);
