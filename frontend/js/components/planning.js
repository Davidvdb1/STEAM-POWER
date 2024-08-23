import WorkshopService from '../../service/workshop.service.js';
import SPAComponent from "./model/SPAComponent.js";
import CampService from '../../service/camp.service.js';

class Planning extends SPAComponent {
  constructor() {
    super();
    this.camp = null;
    this.workshops = [];
    this.filteredWorkshops = [];
  }

  async connectedCallback() {
    await this.renderWorkshops();
  }

  async renderWorkshops() {
    const campId = sessionStorage.getItem('selectedCamp');
    let response = await CampService.fetchCampById(campId);
    this.camp = await response.json();

    this.renderCamp();

    // Fetch the workshop data from the backend using the camp ID
    response = await WorkshopService.fetchWorkshopsByCampIdWithFirstComponents(campId);
    this.workshops = await response.json();
    this.filteredWorkshops = [...this.workshops];

    this.renderWorkshop();
  }


  renderCamp() {
    let content = `
        <h2>Workshops</h2>
        <h5 style="text-align: center; margin-bottom: 1.5rem;">Kamp ${this.camp.title}</h5>
        <div id="workshop-container" class="loading-active">
            <div class="spinner"></div>
        </div>
    `;

    this.innerHTML = content;
  }

  renderWorkshop() {
    const token = sessionStorage.getItem('token');

    let content = `
      <h2>Workshops</h2>
      <h5 style="text-align: center;">Kamp ${this.camp.title}</h5>
    `;

    if (this.filteredWorkshops.length === 0) {
      content += `
        <p style="text-align: center; font-weight: bold;">Er zijn nog geen workshops toegevoegd<br>
        door de leerkracht(en).</p>
      `;
    }

    content += '<div class="planning-container">';

    this.filteredWorkshops.forEach((workshop, index) => {
      content += `
        <article class="planning-article" style="height: 20rem;" id="article-${index}">
          <div style="overflow-y: hidden; height: 100%;">
            <h3 style="width: calc(100% - ${token ? '7.5rem' : '2rem'})">${workshop.name}</h3>
            ${token ? `
              <label style="position: absolute; right: 45px; top: 16px; display: flex;">
                  <input style="margin-right: 3px;" type="checkbox" class="archive-checkbox" data-id="${workshop.id}" ${workshop.archived ? 'checked' : ''}>
                  Archiveer
              </label>
              <div class="settings-icon no-select" id="settings-icon-${index}">&#9881;</div>
              <div class="dropdown" id="dropdown-${index}">
                <a href="#" class="update" data-id="${workshop.id}">Update</a>
                <a href="#" class="delete" data-id="${workshop.id}">Delete</a>
              </div>
              <style>
                .arrow-button {
                  position: absolute;
                  right: 22px;
                  font-weight: bold;
                  font-size: 1.5rem;
                  user-select: none;
                  cursor: pointer;
                  height: 1.4rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              </style>
              <div style="top: 44px;" class="arrow-button" id="up-arrow-${index}">↑</div>
              <div style="top: 68px;" class="arrow-button" id="down-arrow-${index}">↓</div>`
          : ''}
      `;

      let currentUl = '';
      workshop.components.slice(0, 10).forEach((component, index) => {
        if (component.type === 'titel') {
          if (currentUl) {
            content += '</ul>';
            currentUl = '';
          }
          content += `<h4 style="${token && index < 2 ? 'width: 94%' : ''}">${component.content.text}</h4>`;
        } else if (component.type === 'subtitel') {
          if (currentUl) {
            content += '</ul>';
            currentUl = '';
          }
          content += `<h5 style="${token && index < 2 ? 'width: 94%' : ''}">${component.content.text}</h5>`;
        } else if (component.type === 'tekst') {
          if (currentUl) {
            content += '</ul>';
            currentUl = '';
          }
          content += `<p style="${token && index < 2 ? 'width: 94%' : ''}">${component.content.text}</p>`;
        } else if (component.type === 'stappen') {
          if (!currentUl) {
            content += '<ul>';
            currentUl = 'open';
          }
          content += `<li style="${token && index < 2 ? 'width: 94%' : ''}">${component.content.text}</li>`;
        } else if (component.type === 'link') {
          if (!currentUl) {
            content += '<ul>';
            currentUl = 'open';
          }
          content += `<li style="${token && index < 2 ? 'width: 94%' : ''}"><a href="${component.content.url}" style="word-break: break-all;" class="stop-propagation">${component.content.url}</a></li>`;
        } else if (component.type === 'afbeelding') {
          if (currentUl) {
            content += '</ul>';
            currentUl = '';
          }
          if (component.content.isUrl !== 'true') {
            content += `<img src="data:image/jpeg;base64,${component.content.data}" alt="Workshop Image" class="img-scale workshop-image" style="margin-top: 1rem;">`;
          } else {
            content += `<img src="${component.content.path}" alt="Workshop Image" class="img-scale workshop-image" style="margin-top: 1rem;">`;
          }
        }
      });

      if (currentUl) {
        content += '</ul>';
        currentUl = '';
      }
      content += ` <div></article>`;
    });

    if (token) {
      content += `
        <article class="add-workshop" style="height: 20rem; display: flex; align-items: center; justify-content: center;">
          <div style="border: 2px solid; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-weight: bold;">+</div>
        </article>
      `;
    }

    content += `</div>`;

    this.innerHTML = content;

    this.filteredWorkshops.forEach((workshop, index) => {

      let article = document.getElementById(`article-${index}`);
      article.addEventListener('click', () => {
        sessionStorage.setItem('selectedWorkshop', workshop.id);
        navs.switchView(navs.WORKSHOP_DETAILS);
      });

      document.querySelectorAll('.stop-propagation').forEach(link => {
        link.addEventListener('click', event => {
          event.stopPropagation();
        });
      });

      if (token) {
        document.getElementById(`up-arrow-${index}`).addEventListener('click', async (event) => {
          event.stopPropagation();

          const result = await CampService.switchPosition(this.camp.id, workshop.id, true);
          if (result.ok) {
            let currentArticle = document.getElementById(`article-${index}`);
            let switchArticle = currentArticle.previousElementSibling;
            if (switchArticle) {
              currentArticle.parentNode.insertBefore(currentArticle, switchArticle);
            }
          }
        });

        document.getElementById(`down-arrow-${index}`).addEventListener('click', async (event) => {
          event.stopPropagation();

          let currentArticle = document.getElementById(`article-${index}`);
          let switchArticle = currentArticle.nextElementSibling;
          console.log(switchArticle && !switchArticle.classList.contains('add-workshop'));
          if (switchArticle && !switchArticle.classList.contains('add-workshop')) {
            const result = await CampService.switchPosition(this.camp.id, workshop.id, false);
            if (result.ok) {
              currentArticle.parentNode.insertBefore(currentArticle, switchArticle.nextSibling);
            }
          }
        });
      }
    });

    if (token) {
      const checkboxes = document.querySelectorAll('.archive-checkbox');

      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', (event) => {
          event.stopPropagation();
        });

        checkbox.addEventListener('change', async (event) => {
          event.preventDefault();

          const workshopId = event.target.dataset.id;
          try {
            const response = await WorkshopService.toggleArchiveForWorkshop(workshopId);
            if (!response.ok) {
              throw new Error('Failed to toggle archive status');
            }
          } catch (error) {
            console.error('Error toggling archive status:', error);
          }
        });
      });

      this.registerEventListener(this.querySelector('.add-workshop'), 'click', () => {
        sessionStorage.removeItem('workshopToUpdate');
        navs.switchView(navs.SAVE_WORKSHOP);
      });

      this.filteredWorkshops.forEach((workshop, index) => {
        const settingsIcon = this.querySelector(`#settings-icon-${index}`);
        const dropdown = this.querySelector(`#dropdown-${index}`);


        this.registerEventListener(settingsIcon, 'click', (event) => {
          event.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        this.registerEventListener(dropdown.querySelector('.update'), 'click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          sessionStorage.setItem('workshopToUpdate', workshop.id);
          navs.switchView(navs.SAVE_WORKSHOP);
        });

        this.registerEventListener(dropdown.querySelector('.delete'), 'click', async (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (confirm(`Weet je zeker dat je de workshop "${workshop.name}" wilt verwijderen?`)) {
            await WorkshopService.deleteWorkshop(workshop.id);
            await this.renderWorkshops();
          }
        });

        this.registerEventListener(document, 'click', (event) => {
          if (!settingsIcon.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
          }
        });
      });
    }

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
          image.classList = 'img-scale-revert';
        }
      };
    });
  }


}

customElements.define("custom-planning", Planning);
