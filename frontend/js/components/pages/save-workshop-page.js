import WorkshopService from "../../../service/workshop.service.js";
import SPAComponent from "../model/SPAComponent.js";

class SaveWorkshopPage extends SPAComponent {
  constructor() {
    super();
    this.componentIds = {};
  }

  async connectedCallback() {
    const storedWorkshopId = sessionStorage.getItem('workshopToUpdate');

    this.innerHTML = `
      <div id="main-content" class="container-save-workshop loading-active">
        ${storedWorkshopId ? `
          <form id="workshopForm">
          </form>
          <div class="spinner" style="margin-bottom: 10%;"></div>`
        : `
          <h2 id="form-title">Maak een nieuwe workshop</h2>
          <form id="workshopForm">
            <div class="form-group">
              <label for="workshopName">Workshop naam:</label>
              <input type="text" id="workshopName" name="workshopName" required>
            </div>
            <label style="display: flex; align-items: center; margin-bottom: 1rem;">
              <input id="archiveCheckbox" style="margin: 0 5px 0 0; width: auto; transform: scale(1.25);" type="checkbox" class="archive-checkbox">
                Archiveer
            </label>
            <div class="components" id="components">
            </div>
            <div id="first-ctnr">
              <button type="button" class="add-component" id="first-btn" onclick="addComponent()">Voeg een onderdeel/stap toe</button>
            </div>
            <button type="submit" class="save-workshop">Sla workshop op</button>
          </form>
        `}
      </div >
      `;

    const addComponent = (type = '', content = '', index = -1, addBetween = false) => {
      const maxLength = Object.keys(this.componentIds).length;

      const componentsContainer = document.getElementById('components');
      const componentDiv = document.createElement('div');
      componentDiv.className = 'component';
      componentDiv.id = maxLength;

      componentDiv.innerHTML = `
      <button button button type = "button" class="remove-button btn btn-danger" onclick = "removeComponent(this)" > X</button >
        <div class="form-group">
          <label for="componentType${maxLength}">Onderdeel type:</label>
          <select id="componentType${maxLength}" name="componentType${maxLength}" onchange="toggleContentInput(this, ${maxLength})" required>
            <option value="tekst" ${type === 'tekst' ? 'selected' : ''}>Tekst</option>
            <option value="titel" ${type === 'titel' ? 'selected' : ''}>Titel</option>
            <option value="subtitel" ${type === 'subtitel' ? 'selected' : ''}>Subtitel</option>
            <option value="stappen" ${type === 'stappen' ? 'selected' : ''}>Stappen</option>
            <option value="link" ${type === 'link' ? 'selected' : ''}>Link</option>
            <option value="afbeelding" ${type === 'afbeelding' ? 'selected' : ''}>Afbeelding</option>
          </select>
        </div>
        <div class="form-group">
          <label for="contentInput${maxLength}" id="contentLabel${maxLength}" style="display: block;">Content:</label>
          ${type === 'afbeelding' ? `
            <div style="display: flex; justify-content: center;">
              ${content.isUrl !== "true" ?
            `<img src="data:image/jpeg;base64,${content.data}" alt="Workshop Image" style="width: 20rem; height: auto; margin: 1rem 0 1rem 0; border: rgb(221, 221, 221) 1px solid;">`
            :
            `<img src="${content.path}" alt="Workshop Image" style="width: 20rem; height: auto; margin: 1rem 0 1rem 0; border: rgb(221, 221, 221) 1px solid;">`
          }
            </div>
            <input type="text" id="contentUrl${maxLength}" name="contentUrl${maxLength}" class="content-url" value="${type === 'afbeelding' && isValidUrl(content.path) ? content.path : ''}">
            <div class="file-input-container">
              <input type="file" id="contentFile${maxLength}" class="content-file-input">
              <label for="contentFile${maxLength}" id="contentFileLabel${maxLength}" class="content-file-label">Choose file</label>
              <span id="fileNameDisplay${maxLength}" class="file-name-display">${content.fileName ?? ''}</span>
            </div>`
          :
          `<textarea id="contentText${maxLength}" name="contentText${maxLength}" class="content-text" required>${type !== 'link' ? (content.text ? content.text : '') : content.url}</textarea>`
        }
        </div>
    `;

      const btn = document.createElement("button");
      btn.className = "add-component";
      btn.id = `add-component-${maxLength}`;
      btn.innerHTML = "Voeg een onderdeel/stap toe";
      btn.type = "button";

      if (Object.keys(this.componentIds).length === 0) {
        const firstBtn = document.getElementById('first-btn');
        firstBtn.parentNode.removeChild(firstBtn);
      }

      if (addBetween) {

        for (let i = 0; i < maxLength; ++i) {
          if (this.componentIds[i] > this.componentIds[index]) {
            this.componentIds[i]++;
            const existingButton = document.getElementById(`add-component-${i}`)
            existingButton.onclick = () => addComponent('', '', i, true);
          }
        }

        // set new entry with key: increment id maxLength and value: index
        this.componentIds[maxLength] = this.componentIds[index] + 1;
        btn.onclick = () => addComponent('', '', maxLength, true);

        const currentposition = document.getElementById(index);
        componentsContainer.insertBefore(btn, currentposition.nextSibling.nextSibling);
        componentsContainer.insertBefore(componentDiv, currentposition.nextSibling.nextSibling);

      } else {
        this.componentIds[maxLength] = maxLength;
        btn.onclick = () => addComponent('', '', this.componentIds[maxLength], true);
        componentsContainer.appendChild(componentDiv);
        componentsContainer.appendChild(btn);
      }

      if (type === 'afbeelding') {
        const fileButton = document.getElementById(`contentFile${maxLength}`);
        const urlElement = document.getElementById(`contentUrl${maxLength}`);
        const fileNameDisplay = document.getElementById(`fileNameDisplay${maxLength}`);
        // Add event listener for file input change

        this.registerEventListener(fileButton, 'change', (e) => {
          const file = e.target.files[0];
          fileNameDisplay.textContent = file.name;

          if (file && !urlElement.value) {
            updateImagePreview(file);
          }
        });

        // Add event listener for URL input change
        this.registerEventListener(urlElement, 'input', (e) => {
          const url = e.target.value;
          if (url) {
            updateImagePreviewByUrl(url);
          } else {
            const file = fileButton.files[0];
            if (file) {
              updateImagePreview(file);
            } else {
              const imgElement = componentDiv.querySelector('img');
              imgElement.src = `data:image/jpeg;base64,${content.data}`;
            }
          }
        });

        // Initial update of image preview based on initial content
        if (content.isUrl === "true" && content.path) {
          updateImagePreviewByUrl(content.path);
        } else if (content.data) {
          updateImagePreview(content.data);
        }

        // Function to update image preview from file input or URL
        function updateImagePreview(data) {
          if (data instanceof Blob) {
            // If data is a file, read it as a data URL
            const reader = new FileReader();
            reader.onload = function (event) {
              // Set the src attribute of the image element to the data URL
              const imgElement = componentDiv.querySelector('img');
              imgElement.src = event.target.result;
            };
            reader.readAsDataURL(data); // Read the file as data URL
          } else if (isValidUrl(data)) {
            // If data is a valid URL, set it as the src attribute of the image element
            const imgElement = componentDiv.querySelector('img');
            imgElement.src = data;
          }
        }

        // Function to update image preview from URL input
        function updateImagePreviewByUrl(url) {
          const imgElement = componentDiv.querySelector('img');
          imgElement.src = url;
        }
      }
    };
    window.addComponent = addComponent;

    const fillFormWithWorkshopData = (workshop) => {
      document.getElementById('workshopName').value = workshop.name;
      document.getElementById('archiveCheckbox').checked = workshop.archived;
      workshop.components.forEach((component, index) => {
        addComponent(component.type, component.content, index);
      });
    }

    let workshopToUpdate = null;
    // Check if there is a workshop to update
    if (storedWorkshopId !== null) {
      const response = await WorkshopService.fetchWorkshopById(storedWorkshopId);
      workshopToUpdate = await response.json();
      document.getElementById('main-content').innerHTML = `
          <h2 id="form-title">Maak een nieuwe workshop</h2>
          <form id="workshopForm">
            <div class="form-group">
              <label for="workshopName">Workshop naam:</label>
              <input type="text" id="workshopName" name="workshopName" required>
            </div>
            <label style="display: flex; align-items: center; margin-bottom: 1rem;">
              <input id="archiveCheckbox" style="margin: 0 5px 0 0; width: auto; transform: scale(1.25);" type="checkbox" class="archive-checkbox">
                Archiveer
            </label>
            <div class="components" id="components">
            </div>
            <div id="first-ctnr">
              <button type="button" class="add-component" id="first-btn" onclick="addComponent()">Voeg een onderdeel/stap toe</button>
            </div>
            <button type="submit" class="save-workshop">Sla workshop op</button>
          </form>`;

      fillFormWithWorkshopData(workshopToUpdate);
      document.getElementById('form-title').textContent = 'Update workshop';
    }

    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    const toggleContentInput = (selectElement, index) => {
      const componentDiv = selectElement.closest('.component');
      const contentDiv = componentDiv.querySelector('.form-group:nth-child(3)');
      const type = selectElement.value;

      if (type === 'afbeelding') {
        let contentData = '';
        let contentPath = '';
        let fileName = '';
        let url = true;

        if (workshopToUpdate && workshopToUpdate.components && index < workshopToUpdate.components.length) {
          contentData = workshopToUpdate.components[index].content.data;
          contentPath = workshopToUpdate.components[index].content.path;
          fileName = workshopToUpdate.components[index].content.fileName;
          url = workshopToUpdate.components[index].content.isUrl;
        }

        contentDiv.innerHTML = `
      <div div div style = "display: flex; justify-content: center;" >
        ${url !== "true" ?
            `<img src="data:image/jpeg;base64,${contentData}" alt="Workshop Image" style="width: 20rem; height: auto; margin: 1rem 0 1rem 0; border: rgb(221, 221, 221) 1px solid;">`
            :
            `<img src="${contentPath}" alt="Workshop Image" style="width: 20rem; height: auto; margin: 1rem 0 1rem 0; border: rgb(221, 221, 221) 1px solid;">`
          }
                    </div >
                    <label for="contentUrl${index}" id="contentLabel${index}" style="display: block;">Content:</label>
                    <input type="text" id="contentUrl${index}" name="contentUrl${index}" class="content-url" value="${type === 'afbeelding' && isValidUrl(contentPath) ? contentPath : ''}">
                    <div class="file-input-container">
                        <input type="file" id="contentFile${index}" class="content-file-input">
                        <label for="contentFile${index}" class="content-file-label">bestand kiezen</label>
                        <span id="fileNameDisplay${index}" class="file-name-display">${fileName ?? ''}</span>
                    </div>
                `;

        if (type === 'afbeelding') {
          const fileButton = document.getElementById(`contentFile${index}`);
          const urlElement = document.getElementById(`contentUrl${index}`);
          const fileNameDisplay = document.getElementById(`fileNameDisplay${index}`);
          // Add event listener for file input change
          this.registerEventListener(fileButton, 'change', (e) => {
            const file = e.target.files[0];
            fileNameDisplay.textContent = file.name;

            if (file && !urlElement.value) {
              updateImagePreview(file);
            }
          });

          // Add event listener for URL input change
          this.registerEventListener(urlElement, 'input', (e) => {
            const url = e.target.value;
            if (url) {
              updateImagePreviewByUrl(url);
            } else {
              const file = fileButton.files[0];
              if (file) {
                updateImagePreview(file);
              } else {
                const imgElement = componentDiv.querySelector('img');
                imgElement.src = ``;
              }
            }
          });

          // Function to update image preview from file input or URL
          function updateImagePreview(data) {
            if (data instanceof Blob) {
              // If data is a file, read it as a data URL
              const reader = new FileReader();
              reader.onload = function (event) {
                // Set the src attribute of the image element to the data URL
                const imgElement = componentDiv.querySelector('img');
                imgElement.src = event.target.result;
              };
              reader.readAsDataURL(data); // Read the file as data URL
            } else if (isValidUrl(data)) {
              // If data is a valid URL, set it as the src attribute of the image element
              const imgElement = componentDiv.querySelector('img');
              imgElement.src = data;
            }
          }

          // Function to update image preview from URL input
          function updateImagePreviewByUrl(url) {
            const imgElement = componentDiv.querySelector('img');
            imgElement.src = url;
          }
        }

      } else {
        const previewFilledInValue = contentDiv.getElementsByTagName('textarea')[0]?.value;

        contentDiv.innerHTML = `
          <label for="contentText${index}" id="contentLabel${index}">Content:</label>
          <textarea id="contentText${index}" name="contentText${index}" class="content-text" required>${previewFilledInValue ? previewFilledInValue : ''}</textarea>
      `;
      }
    }
    window.toggleContentInput = toggleContentInput;

    const removeComponent = (button) => {
      button.parentElement.nextSibling.remove();
      button.parentElement.remove();
      delete this.componentIds[button.parentElement.id];
      if (Object.keys(this.componentIds).length === 0) {
        const firstCtnr = document.getElementById('first-ctnr');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'add-component';
        button.id = 'first-btn';
        button.onclick = () => addComponent();
        button.textContent = 'Voeg een onderdeel/stap toe';
        firstCtnr.appendChild(button);
      }
    }
    window.removeComponent = removeComponent;

    function generateUniqueIdentifier() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }

    this.registerEventListener(document.getElementById('workshopForm'), 'submit', async (event) => {
      event.preventDefault();

      const workshopName = document.getElementById('workshopName').value;
      const archived = document.getElementById('archiveCheckbox').checked;
      const components = [];
      const formData = new FormData();
      const uniqueIdentifiers = [];

      for (let [key, value] of Object.entries(this.componentIds)) {
        const typeElement = document.getElementById(`componentType${key}`);
        const urlElement = document.getElementById(`contentUrl${key}`);
        const fileElement = document.getElementById(`contentFile${key}`);
        const textElement = document.getElementById(`contentText${key}`);

        if (typeElement) {
          const componentData = {
            type: typeElement.value,
            position: value + 1
          };

          if (typeElement.value === 'afbeelding') {
            if (urlElement.value) {
              componentData.content = {
                path: urlElement.value,
                isUrl: "true"
              };
            } else if (fileElement.files[0]) {
              const uniqueIdentifier = generateUniqueIdentifier();

              // how also generate a unique idetifier for the file
              const file = fileElement.files[0];
              formData.append('files', file);
              uniqueIdentifiers.push(uniqueIdentifier);

              componentData.content = {
                isUrl: "false",
                fileData: file.name,
                fileUid: uniqueIdentifier
              };
            } else if (workshopToUpdate.components[key] && workshopToUpdate.components[key].content) {
              const uniqueIdentifier = generateUniqueIdentifier();
              const fileName = workshopToUpdate.components[key].content.fileName;
              const base64Data = workshopToUpdate.components[key].content.data;
              const contentType = "application/octet-stream";

              const fileBlob = base64ToBlob(base64Data, contentType);
              const file = blobToFile(fileBlob, fileName);

              formData.append('files', file);
              uniqueIdentifiers.push(uniqueIdentifier);

              componentData.content = {
                isUrl: "false",
                fileData: workshopToUpdate.components[key].content.fileName,
                fileUid: uniqueIdentifier
              };
            }
          } else {
            componentData.content = textElement.value;
          }

          components.splice(value, 0, componentData);
        }
      }

      // Get the camp ID
      const campId = sessionStorage.getItem('selectedCamp');;

      const workshop = {
        campId: campId,
        name: workshopName,
        archived: archived,
        components: components
      };

      formData.append('workshopData', JSON.stringify(workshop));
      formData.append('fileIdentifiers', JSON.stringify(uniqueIdentifiers));

      try {
        let response;
        if (workshopToUpdate) {
          response = await WorkshopService.updateWorkshop(workshopToUpdate.id, formData);
        } else {
          response = await WorkshopService.createWorkshop(formData);
        }

        if (response.ok) {
          navs.switchView(navs.WORKSHOPS);
        } else {
          alert('Failed to save workshop.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the workshop.');
      }
    });

    this.registerEventListener(window, 'beforeunload', () => {
      if (workshopToUpdate) {
        sessionStorage.setItem('workshopToUpdate', workshopToUpdate.id);
      }
    });

    // Function to convert a base64 string to a Blob
    function base64ToBlob(base64, contentType) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    }

    // Function to convert a Blob to a File
    function blobToFile(blob, fileName) {
      return new File([blob], fileName, { type: blob.type });
    }
  }
}

customElements.define("save-workshop-page", SaveWorkshopPage);
