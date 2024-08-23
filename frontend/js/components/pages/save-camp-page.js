import CampService from "../../../service/camp.service.js";
import SPAComponent from "../model/SPAComponent.js";

class SaveCampPage extends SPAComponent {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.innerHTML = `
        <div id="main-content" class="container-save-workshop"><h2 id="form-title">Maak een nieuw kamp</h2>
            <form id="workshopForm">

                <style>
                  #error-messages {
                      margin-top: 1rem;
                      padding: 0.5rem;
                      border: 1px solid #dc3545; /* Red border */
                      background-color: #f8d7da; /* Light red background */
                      color: #721c24; /* Dark red text color */
                      border-radius: 0.25rem;
                      display: none;
                  }

                  #error-messages div {
                      margin-bottom: 0.5rem;
                  }
                </style>
                <div id="error-messages" class="text-danger"></div>

                <div class="form-group">
                    <label for="kampTitel" style="margin-top: 1rem;">kamp titel:</label>
                    <input type="text" id="kampTitel" name="kampTitel" required>

                    <label for="startDate" style="margin-top: 1rem;">start datum:</label>
                    <input type="date" id="startDate" name="startDate" required>
                    <label for="endDate" style="margin-top: 1rem;">eind datum:</label>
                    <input type="date" id="endDate" name="endDate" required>

                    <label for="startAge" style="margin-top: 1rem;">start leeftijd:</label>
                    <input type="number" id="startAge" name="startAge" required>
                    <label for="endAge" style="margin-top: 1rem;">eind leeftijd:</label>
                    <input type="number" id="endAge" name="endAge" required>

                    <label for="startTime" style="margin-top: 1rem;">start uur:</label>
                    <input type="time" id="startTime" name="startTime" required>
                    <label for="endTime" style="margin-top: 1rem;">eind uur:</label>
                    <input type="time" id="endTime" name="endTime" required>

                    <label for="location" style="margin-top: 1rem;">locatie:</label>

                    <input type="text" id="location" name="location" required>

                    <div style="display: flex; justify-content: center;">
                        <img id="imagePreview" src="" alt="Camp Image" style="width: 20rem; height: auto; margin: 1rem 0 1rem 0; border: rgb(221, 221, 221) 1px solid;">
                    </div>
                    <label for="contentUrl" style="margin-top: 1rem;">Afbeelding URL:</label>
                    <input type="text" id="contentUrl" name="contentUrl" class="content-url">
                    <div class="file-input-container" style="margin-top: 1rem;">
                        <input type="file" id="contentFile" class="content-file-input">
                        <label for="contentFile" id="contentFileLabel" class="content-file-label">Kies bestand</label>
                        <span id="fileNameDisplay" class="file-name-display"></span>
                    </div>
                </div>

                <dropdown-component></dropdown-component>

                <label style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <input id="archiveCheckbox" style="margin: 0 5px 0 0; width: auto; transform: scale(1.25);" type="checkbox" class="archive-checkbox">
                    Archiveer
                </label>

                <button type="submit" class="add-component">Sla kamp op</button>
            </form>
          </div>`;

    let campToUpdate = null;

    // Check if there is a workshop to update
    const storedCampId = sessionStorage.getItem('campToUpdate');
    if (storedCampId !== null) {
      const response = await CampService.fetchCampById(storedCampId);
      campToUpdate = await response.json();
      document.getElementById('form-title').textContent = 'Update kamp';

      // Populate form fields with campToUpdate data
      document.getElementById('kampTitel').value = campToUpdate.title;
      document.getElementById('startDate').value = formatDate(campToUpdate.startDate);
      document.getElementById('endDate').value = formatDate(campToUpdate.endDate);
      document.getElementById('startAge').value = campToUpdate.startAge;
      document.getElementById('endAge').value = campToUpdate.endAge;
      document.getElementById('startTime').value = campToUpdate.startTime;
      document.getElementById('endTime').value = campToUpdate.endTime;
      document.getElementById('location').value = campToUpdate.location;
      document.getElementById('archiveCheckbox').checked = campToUpdate.archived;

      // Populate content URL or file input based on the type of content
      const content = campToUpdate.content;
      if (content.isUrl === "true") {
        document.getElementById('contentUrl').value = content.path;
        updateImagePreviewByUrl(content.path);
      } else if (content.data) {
        document.getElementById('imagePreview').src = `data:image/jpeg;base64,${content.data}`;
        document.getElementById('fileNameDisplay').textContent = content.fileName;
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      // Pad single digit month and day with leading zero
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }

      return `${year}-${month}-${day}`;
    }

    // image preview functionality
    const contentUrlInput = document.getElementById('contentUrl');
    const contentFileInput = document.getElementById('contentFile');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    this.registerEventListener(contentUrlInput, 'input', function (e) {
      const url = e.target.value;
      if (url) {
        updateImagePreviewByUrl(url);
      } else {
        const file = contentFileInput.files[0];
        if (file) {
          updateImagePreview(file);
        } else if (campToUpdate.content.data) {
          imagePreview.src = `data:image/jpeg;base64,${campToUpdatecontent.data}`;
        } else {
          imagePreview.src = '';
        }
      }
    });

    this.registerEventListener(contentFileInput, 'change', function (e) {
      const file = e.target.files[0];
      fileNameDisplay.textContent = file.name;

      if (file && !contentUrlInput.value) {
        updateImagePreview(file);
      }
    });

    // Function to update image preview from URL input
    function updateImagePreviewByUrl(url) {
      const imagePreview = document.getElementById('imagePreview');
      imagePreview.src = url;
    }

    function updateImagePreview(data) {
      if (data instanceof Blob) {
        // If data is a file, read it as a data URL
        const reader = new FileReader();
        reader.onload = function (event) {
          // Set the src attribute of the image element to the data URL
          imagePreview.src = event.target.result;
        };
        reader.readAsDataURL(data); // Read the file as data URL
      } else if (isValidUrl(data)) {
        // If data is a valid URL, set it as the src attribute of the image element
        imagePreview.src = data;
      }
    }

    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }


    this.registerEventListener(document.getElementById('workshopForm'), 'submit', async function (event) {
      event.preventDefault();

      const campTitel = document.getElementById('kampTitel').value;

      const campStartDate = document.getElementById('startDate').value;
      const campEndDate = document.getElementById('endDate').value;

      const campStartTime = document.getElementById('startTime').value.slice(0, 5);
      const campEndTime = document.getElementById('endTime').value.slice(0, 5);

      const campStartAge = document.getElementById('startAge').value;
      const campEndAge = document.getElementById('endAge').value;

      const campLocation = document.getElementById('location').value;

      const formData = new FormData();
      const uniqueIdentifiers = [];

      const urlElement = document.getElementById('contentUrl');
      const fileElement = document.getElementById('contentFile');

      const archived = document.getElementById('archiveCheckbox').checked;

      let content = {};

      if (urlElement.value) {
        content = {
          path: urlElement.value,
          isUrl: "true"
        };
      } else if (fileElement.files[0]) {
        const uniqueIdentifier = generateUniqueIdentifier();

        // how also generate a unique identifier for the file
        const file = fileElement.files[0];
        formData.append('files', file);
        uniqueIdentifiers.push(uniqueIdentifier);

        content = {
          isUrl: "false",
          fileData: file.name,
          fileUid: uniqueIdentifier
        };
      } else if (campToUpdate) {
        content = campToUpdate.content;
      }

      const camp = {
        title: campTitel,
        startDate: campStartDate,
        endDate: campEndDate,
        startAge: campStartAge,
        endAge: campEndAge,
        startTime: campStartTime,
        endTime: campEndTime,
        location: campLocation,
        content: content,
        archived: archived
      };

      formData.append('fileIdentifiers', JSON.stringify(uniqueIdentifiers));

      // Get a reference to the dropdown component
      const dropdownComponent = document.querySelector('dropdown-component');
      // Call the getData() method of the dropdown component
      const dropdownData = dropdownComponent.getData();

      // Assuming you want to append the dropdown data to formData
      formData.append('dropdownData', JSON.stringify(dropdownData));

      camp.workshopRelations = dropdownData;
      formData.append('campData', JSON.stringify(camp));

      try {
        let response;
        if (campToUpdate) {
          response = await CampService.updateCamp(campToUpdate.id, formData);
        } else {
          response = await CampService.createCamp(formData);
        }

        if (response.ok) {
          navs.switchView(navs.CAMPS);
        } else if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.explanation) {
            displayErrors(errorData.explanation);
          }
        } else {
          alert('An error occurred while saving the camp.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the camp.');
      }
    });
    function generateUniqueIdentifier() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }

    function displayErrors(errors) {
      const errorMessagesContainer = document.getElementById('error-messages');
      errorMessagesContainer.style.display = 'block'; // Show the error messages container
      errorMessagesContainer.innerHTML = ''; // Clear previous error messages

      const errorList = document.createElement('ul'); // Create an unordered list for the error messages

      for (const [key, value] of Object.entries(errors)) {
        const errorMessageItem = document.createElement('li'); // Create a list item for each error message
        if (value == 'Start date must be in the future') {
          errorMessageItem.textContent = 'Start datum moet in de toekomst liggen.';
        } else if (value == 'End date must be after start date') {
          errorMessageItem.textContent = 'Eind datum moet na de start datum liggen.';
        } else if (value == 'Start age must be a number between 0 and 100') {
          errorMessageItem.textContent = 'Start leeftijd moet een getal zijn tussen 0 en 100.';
        } else if (value == 'End age must be greater than or equal to start age') {
          errorMessageItem.textContent = 'value moet groter of gelijk zijn aan de start leeftijd.';
        } else if (value == 'End age must be a number between 0 and 100') {
          errorMessageItem.textContent = 'Eindleeftijd moet een getal tussen 0 en 100 zijn.';
        } else {
          errorMessageItem.textContent = value;
        }
        errorList.appendChild(errorMessageItem); // Append each error message to the list
      }

      errorMessagesContainer.appendChild(errorList); // Append the list to the error messages container

      window.scrollTo({
        top: 0,
        behavior: 'smooth' // You can also use 'auto' for instant scrolling
      });
    }
  }
}

customElements.define("save-camp-page", SaveCampPage);
