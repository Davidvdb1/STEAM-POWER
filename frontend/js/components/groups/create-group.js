import ClassroomService from '../../../service/classroom.service.js';
import { ErrorEnum } from '../../../types/errorEnum.js';
import SPAComponent from "../model/SPAComponent.js";

class CreateGroup extends SPAComponent {
    constructor() {
        super();
        this.error = null; // Initialize error property
        this.value = ''; // Initialize input value property
        this.generateFormHtml(); // Generate form HTML during initialization
        this.registerEventListener(this, 'submit', this.handleFormSubmit.bind(this))
    }


    generateFormHtml() {
        this.innerHTML = `
            <form id="createGroupForm" class="bg-body-tertiary">
                <h2>Maak een groep aan</h2>
                ${this.error != null ? `<p class="mb-1 text-danger text-start">${this.error}</p>` : ''}
                <input id="nameInput" type="text" placeholder="Naam" value="${this.value}"></input>
                <input id="create" type="submit" value="creëer"></input>
            </form>
        `;
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        var name = document.getElementById('nameInput').value.trim();

        if (name === '') {
            this.error = 'Naam mag niet leeg zijn.';
            this.value = name; // Retain the input value
        } else if (name.length > 20) {
            this.error = 'Naam mag niet meer dan 20 karakters hebben.';
            this.value = name; // Retain the input value
        } else {
            var obj = { name: name };
            const success = await this.createClassroom(obj);
            if (success) {
                this.error = null;
                this.value = ''; // Clear the input value on success
            } else {
                this.value = name; // Retain the input value on failure
            }
        }

        this.generateFormHtml(); // Update form HTML after form submission
    }

    async createClassroom(classroom) {
        try {
            const response = await ClassroomService.createClassroom(classroom);
            if (response.ok) {
                const data = await response.json();
                let element = document.querySelector('group-overview');
                element.data = [...element._data, data]; // This will automatically re-render the component
                return true;
            } else if (response.status === 400) {
                const responseData = await response.json();

                if (responseData.errorEnum === ErrorEnum.AlreadyExists) {
                    this.error = 'Er bestaat al een groep met deze naam.';
                } else {
                    this.error = 'Er is een fout opgetreden. Probeer het later opnieuw.';
                }
                return false;
            } else {
                this.error = 'Er is een fout opgetreden. Probeer het later opnieuw.';
                return false;
            }
        } catch (error) {
            console.error('Error creating classrooms:', error);
            return false;
        }
    }
}

customElements.define('create-group', CreateGroup);
