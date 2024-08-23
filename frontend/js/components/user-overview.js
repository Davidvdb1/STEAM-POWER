import userService from "../../service/user.service.js";
import SPAComponent from "./model/SPAComponent.js";

class UserOverview extends SPAComponent {
    constructor() {
        super();
        this.users = [];
    }

    async connectedCallback() {
        await this.init();
    }

    async init() {
        const response = await userService.fetchUsers();
        if (response.ok) {
            this.users = await response.json();
        }
        this.generateTableHtml();
    }

    generateTable() {
        let table = `
        <div class="table-responsive">
          <table class="table table-striped">
            <tr>
              <th>Email</th>
              <th></th>
              <th></th>
            </tr>`;
        this.users.forEach((user, index) => {
            table += `<tr>
          <td style="vertical-align: middle;">
            ${user.email}
          </td>
          <td style="vertical-align: middle;">
            <label style="display: flex; align-items: center;">
                <input id="archiveCheckbox" style="margin: 0 5px 0 0; width: auto; transform: scale(1.25);" type="checkbox" class="archive-checkbox" ${user.archived ? 'checked' : ''}>
                aan/uit
            </label>
        </td>
          <td style="width: 0.1rem;">
              <button id="delete-${index}" class="btn btn-danger">Delete</button>
          </td>
        </tr>`;
        });
        table += '</table></div>';

        this.innerHTML += table;

        const archiveCheckboxes = this.querySelectorAll('.archive-checkbox');
        archiveCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', async () => {
                const response = await userService.toggleUserArchived(this.users[index].id);
                if (response.ok) {
                    this.users[index].archived = !this.users[index].archived;
                } else {
                    // Handle error
                    console.error('Failed to toggle user archived status');
                }
            });
        });

        const deleteButtons = this.querySelectorAll('.btn.btn-danger');
        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', async () => {
                // Show confirmation message
                if (confirm('Are you sure you want to delete this user?')) {
                    const response = await userService.deleteUser(this.users[index].id);
                    if (response.ok) {
                        this.users.splice(index, 1);
                        this.generateTableHtml();
                    } else {
                        console.error('Failed to delete user:', response.statusText);
                    }
                }
            });
        });
    }

    generateTableHtml() {
        this.innerHTML = '<h2 class="mb-3">Gebruikers Overzicht</h2>';
        { this.users.length > 0 ? this.generateTable() : this.innerHTML += '<p style="text-align: center; font-weight: bold;">Er bestaan nog geen andere leerkrachten accounts.</p>'; }
    }
}

customElements.define('user-overview', UserOverview);
