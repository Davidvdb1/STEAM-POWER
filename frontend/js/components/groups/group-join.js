import ClassroomService from '../../../service/classroom.service.js';
import { ErrorEnum } from '../../../types/errorEnum.js';
import SPAComponent from "../model/SPAComponent.js";

class GroupJoin extends SPAComponent {
  constructor() {
    super();
    this.error = null; // Initialize error property
    this.value = ''; // Initialize input value property
    this.generateFormHtml(); // Generate form HTML during initialization
    this.registerEventListener(this, 'submit', this.handleFormSubmit.bind(this));
  }


  generateFormHtml() {
    this.innerHTML = `
      <form>
          <h2>Deelnemen aan group</h2>
          ${this.error != null ? `<p class="mb-1 text-danger text-start">${this.error}</p>` : ''}

          <label for="code">Code:</label>
          <input type="text" id="classCode" value="${this.value}"></input>
          <input type="submit" value="Deelnemen"></input>
      </form>
    `;
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    var code = document.getElementById('classCode').value.trim();

    if (code === '') {
      this.error = 'U heeft geen code ingevuld.';
      this.value = code; // Retain the input value
    } else {
      this.error = null;
      const success = await this.joinClassroom(code);
      if (success) {
        this.value = ''; // Clear the input value on success
        this.dispatchEvent(new CustomEvent('group-joined', { bubbles: true })); // Dispatch custom event
        navs.switchView(navs.OVERZICHT); // Navigate to the overzicht page
      } else {
        this.value = code; // Retain the input value on failure
      }
    }

    this.generateFormHtml(); // Update form HTML after form submission
  }

  async joinClassroom(code) {
    try {
      const response = await ClassroomService.joinClassroom(code);
      if (response.ok) {
        const tokenData = await response.json();
        sessionStorage.setItem(
          'currentGroup',
          JSON.stringify({
            token: tokenData.token,
            id: tokenData.id,
            code: tokenData.code,
            name: tokenData.name,
          })
        );
        return true;
      } else if (response.status === 400) {
        const responseData = await response.json();

        if (Number(responseData.message) === ErrorEnum.InvalidCode) {
          this.error = 'De ingegeven code is ongeldig.';
        } else {
          this.error = 'Er is een fout opgetreden. Probeer het later opnieuw.';
        }
        return false;
      } else {
        this.error = 'Er is een fout opgetreden. Probeer het later opnieuw.';
        return false;
      }
    } catch (error) {
      console.error('Error joining classroom:', error);
      return false;
    }
  }
}

customElements.define('group-join', GroupJoin);
