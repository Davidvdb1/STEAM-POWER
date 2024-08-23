import ClassroomService from '../../../service/classroom.service.js';
import { ErrorEnum } from '../../../types/errorEnum.js';
import SPAComponent from "../model/SPAComponent.js";

export class GroupOverview extends SPAComponent {
    constructor() {
        super();
        this._data = [];
        this.editingStates = {}; // Track the editing state and values of each entry
    }

    connectedCallback() {
        this.fetchClassrooms();
    }

    async fetchClassrooms() {
        try {
            const response = await ClassroomService.fetchAllClassrooms();
            if (response.ok) {
                const data = await response.json();
                this.data = data; // Update the component's data with the fetched classrooms
            } else {
                console.error('Failed to fetch classrooms:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        }
    }

    async deleteClassroom(classroomId) {
        try {
            const response = await ClassroomService.deleteClassroom(classroomId);
            if (response.ok) {
                // Refresh data after successful deletion
                this.fetchClassrooms();
            } else {
                console.error('Failed to delete classroom:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting classroom:', error);
        }
    }

    async resetClassrooms() {
        try {
            const response = await ClassroomService.resetClassrooms();
            if (response.ok) {
                // Refresh data after successful deletion
                this.fetchClassrooms();
            } else {
                console.error('Failed to reset classrooms:', response.statusText);
            }
        } catch (error) {
            console.error('Error resetting classrooms:', error);
        }
    }

    set data(newData) {
        this._data = newData;
        if (this._data.length > 0) {
            this.render();
        } else {
            this.innerHTML = `<p style="text-align: center; font-weight: bold;">Er zijn nog geen groepen aangemaakt.</p>`;
        }
    }

    render() {
        let table = `<div class="table-responsive">
                        <table class="table table-striped table-bordered m-0">
                            <thead class="thead-dark">
                                <tr>
                                    <th>Groep Naam</th>
                                    <th>Code</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>`;
        this._data.forEach((item, index) => {
            const isEditing = this.editingStates[item.id]?.isEditing || false;
            const currentValue = this.editingStates[item.id]?.value || item.name;

            table += `<tr>
                        <td class="align-middle" style="width: 40%">
                            <div>
                                <span id="name-${index}" style="display:${isEditing ? 'none' : 'inline'};">${item.name}</span>
                                <input class="w-auto p-1 m-0" type="text" id="name-input-${index}" value="${currentValue}" style="display:${isEditing ? 'inline' : 'none'};" />
                            </div>
                        </td>
                        <td class="align-middle">
                            <div class="d-flex justify-content-between align-items-center">
                                <div id="code-${index}" style="margin-right: 0.5rem;">
                                    ${item.code}
                                </div>
                                <button id="copy-${index}" type="button" class="btn btn-outline-dark btn-sm ml-2">
                                    <img src="./img/copy-button.png" alt="Copy" style="width: 20px;">
                                </button>
                            </div>
                        </td>
                        <td style="width: 0.1rem;">
                            <button id="update-${index}" class="btn btn-primary text-white" style="width:5rem;">${isEditing ? 'Save' : 'Update'}</button>
                        </td>
                        <td style="width: 0.1rem;">
                            <button id="delete-${index}" class="btn btn-danger">Delete</button>
                        </td>
                      </tr>`;
        });

        table += `
            <div class="modal" tabindex="-1" id="error-modal">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Error</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p id="error-message" class="m-0"></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        table += `</tbody>
                        </table>
                      </div>
                      <div class="d-flex justify-content-end mt-3">
                          <button id="reset" class="btn btn-primary">Reset week</button>
                      </div>`;

        this.innerHTML = table;

        this._data.forEach((item, index) => {

            this.registerEventListener(this.querySelector(`#delete-${index}`), 'click', () => {
                if (confirm('Weet je zeker dat je deze groep wilt verwijderen, alle data omtrent deze groep zal verloren gaan?')) {
                    this.deleteClassroom(item.id);
                }
            });

            const updateButton = this.querySelector(`#update-${index}`);
            const nameInput = this.querySelector(`#name-input-${index}`);
            this.registerEventListener(nameInput, 'input', (e) => {
                if (!this.editingStates[item.id]) {
                    this.editingStates[item.id] = {};
                }
                this.editingStates[item.id].value = e.target.value; // Track the current value
            });

            this.registerEventListener(updateButton, 'click', () => {
                const nameSpan = this.querySelector(`#name-${index}`);
                if (updateButton.innerText === 'Update') {
                    nameSpan.style.display = 'none';
                    nameInput.style.display = 'inline';
                    updateButton.innerText = 'Save';
                    this.editingStates[item.id] = {
                        isEditing: true,
                        value: nameInput.value,
                    }; // Set the editing state
                } else {
                    item.name = nameInput.value.trim();
                    this.handleFormSubmit(item.id, item);
                }
            });

            this.registerEventListener(this.querySelector(`#copy-${index}`), 'click', () => {
                navigator.clipboard.writeText(document.getElementById(`code-${index}`).textContent.trim());
            });
        });

        this.registerEventListener(this.querySelector('#reset'), 'click', () => {
            if (confirm('Weet je zeker dat je de week wilt resetten?')) {
                this.resetClassrooms();
            }
        });
    }

    async handleFormSubmit(classroomId, classroom) {
        const errorMessageElement = this.querySelector('#error-message');
        const errorModal = new bootstrap.Modal(this.querySelector('#error-modal'));

        if (classroom.name === '') {
            errorMessageElement.innerText = 'Naam mag niet leeg zijn.';
            errorModal.show();
        } else if (classroom.name.length > 20) {
            errorMessageElement.innerText = 'Naam mag niet meer dan 20 karakters hebben.';
            errorModal.show();
        } else {
            await this.updateClassroom(classroomId, classroom);
        }
    }

    async updateClassroom(classroomId, classroom) {
        try {
            const errorMessageElement = this.querySelector('#error-message');
            const errorModal = new bootstrap.Modal(this.querySelector('#error-modal'));

            const response = await ClassroomService.updateClassroom(classroomId, classroom);
            if (response.ok) {
                errorMessageElement.innerText = '';
                delete this.editingStates[classroomId]; // Clear the editing state after update
                this.fetchClassrooms();
            } else if (response.status === 400) {
                const responseData = await response.json();

                if (Number(responseData.message) === ErrorEnum.NameAlreadyInUse) {
                    errorMessageElement.innerText = 'Er bestaat al een groep met deze naam.';
                } else {
                    errorMessageElement.innerText = 'Er is een fout opgetreden. Probeer het later opnieuw.';
                }
                errorModal.show();
                return false;
            } else {
                errorMessageElement.innerText = 'Er is een fout opgetreden. Probeer het later opnieuw.';
                errorModal.show();
                return false;
            }
        } catch (error) {
            console.error('Error updating classroom:', error);
        }
    }
}

customElements.define('group-overview', GroupOverview);
