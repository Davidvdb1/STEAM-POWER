import ClassroomService from "../../service/classroom.service.js";

class EnergyVoorwerpOverview extends HTMLElement {
    constructor() {
        super();
        this.energy = 0.00;
        this.fetchEnergy = (value) => {
            if (this.energy != value) {
                this.energy = value;
                this.generateHtml();
            }
            this.energy = value;
        }


        classroomEnergyObserver.setFetchEnergy(ClassroomService.fetchClassroomById);
        classroomEnergyObserver.subscribe({ name: 'energy-item-fetchEnergy', cb: this.fetchEnergy });
    }

    connectedCallback() {
        this.generateHtml();
    }

    generateHtml() {
        this.innerHTML = `
        <div class="div">

            <div class="card" style="margin-top: 0">
                ${(this.energy >= 15 ? "<b class='chargable-card'>🔋</b>" : "<b class='chargable-card'>🪫</b>")}
                <h2>Ledstrip</h2>
                <p> Typisch neemt een LED strip tussen de <strong>14 en 15 W/meter.</strong>
                Elke LED van een LED strip zou minder dan <strong>0.2 Watt</strong> Vermogen vragen.
                Dus met <strong>1 Watt-seconde</strong> kan je één LED van een LED strip
                <strong>5 seconden</strong> laten branden. </p>
                <div class="flex-center-container">
                    <p class="multiplier">3 X</p>
                    <img src="img/solarpanel.jpg" alt="Solarpanel Image" class="solarpanel">
                    <p class="equals">=</p>
                    <p class="multiplier">1 meter</p>
                    <img src="img/ledstrips.jpg" alt="Phone Image" class="solarpanel">
                </div>
            </div>


            <div class="card" style="margin-top: 0">
                ${(this.energy >= 25 ? "<b class='chargable-card'>🔋</b>" : "<b class='chargable-card'>🪫</b>")}
                <h2>Gloeilamp</h2>
                <p>Een gloeilamp van <strong>200-300 Lumen</strong> verbruik: ongeveer <strong>25 tot 30 Watt</strong>.
                De lumen (symbool: lm) is de eenheid voor lichtstroom. Het is een maat voor de totale hoeveelheid zichtbaar licht die een lichtbron in alle richtingen uitstraalt.
                Met andere woorden hoe harder de lamp brand hoe hoger dit lumen getal zal zijn.
                Zo verbruikt bijvoorbeeld een gloeilamp met <strong>1250-2000 Lumen</strong> wel <strong>150 tot 250 Watt</strong>.</p>
                <div class="flex-center-container">
                    <p class="multiplier">6 X</p>
                    <img src="img/solarpanel.jpg" alt="Solarpanel Image" class="solarpanel">
                    <p class="equals">=</p>
                    <img src="img/gloeilamp.jpeg" alt="Phone Image" class="solarpanel">
                </div>
            </div>

            <div class="card">
                ${(this.energy >= (10 * 3 * 3600) ? "<b class='chargable-card'>🔋</b>" : "<b class='chargable-card'>🪫</b>")}
                <h2>GSM</h2>
                <p>Een gemiddelde smartphone van tegenwoordig heeft het vermogen van <strong>10 á 11 Watt per uur</strong>.
                Met een normale <strong>USB-oplader die 3.5 Watt levert</strong>, zou het dus ongeveer <strong>3 á 3,5 uur duren voordat de telefoon volledig is opgeladen</strong>.</p>
                <div class="flex-center-container">
                    <p class="multiplier">3 X</p>
                    <img src="img/solarpanel.jpg" alt="Solarpanel Image" class="solarpanel">
                    <p class="equals">=</p>
                    <img src="img/gsm.jpg" alt="Phone Image" class="solarpanel">
                </div>
            </div>

            <div class="card">
                ${(this.energy >= (15000 * 3600) ? "<b class='chargable-card'>🔋</b>" : "<b class='chargable-card'>🪫</b>")}

                <h2>Elektrische wagen</h2>
                <p>Bij het gebruik van elektrische auto's druk je het verbruik ook uit in het aantal kilometers per energie-eenheid. Dit is een kilowattuur (kWh). Er zijn twee eenheden die op elkaar lijken: kiloWatt (kW) en kiloWattuur (kWh). Dit zijn echter verschillende grootheden.<br>
                Voor meer duidelijkheid te schetsen van wat nu eenmaal een KW is; 1 KW is hetzelfde als 1000 Watt.</p>
                <p>kWh is een vaste meeteenheid voor de hoeveelheid energie, die bijvoorbeeld past in een volle batterij. De batterij in een elektrische auto wordt altijd omschreven in het aantal kWh oftewel de hoeveelheid energie die past er in een volle batterij.<br></p>
                <p>kW is daarentegen de eenheid voor kracht/vermogen. Je berekent kW namelijk door het voltage = 230 maal het Amperage (16) te vermenigvuldigen. 16 x 230 is (afgerond) 3,7 kW. Voluit: 16 x 230 = 3680 Watt. Dat delen we door 1000 om er kW van te maken = 3,7 kW.<br>
                Bij een elektrische auto wordt het verbruik dus wat anders uitgedrukt. Bijvoorbeeld: "14 kWh per 100 km".<br></p>
                <p>Hoeveel stroom verbruikt een elektrische auto dan echt?<br>
                Het verbruik van een elektrische auto is afhankelijk van een aantal factoren, zoals het vermogen van de motor en het gewicht. Het gemiddelde verbruik van een elektrische auto ligt tussen de 8 kWh en 30 kWh per 100 kilometer. Stel dat je 10.000 kilometer per jaar rijdt, dan verbruik je met een auto die 15 kWh per 100 kilometer rijdt, 1500 kWh per jaar.<br></p>
                <p><strong>Verbruik van bekende modellen:</strong><br>
                Audi e-tron S 55 quattro: 27 kWh per 100 km<br>
                Nissan Leaf: 16,5 kWh per 100 km<br>
                Tesla Model 3: 14,9 kWh per 100 km<br>
                Mini Cooper SE: 15,6 kWh per 100 km</p>
                <div class="flex-center-container">
                    <p class="multiplier">28 X</p>
                    <img src="img/solarpanel.jpg" alt="Solarpanel Image" class="solarpanel">
                    <p class="equals">=</p>
                    <p class="multiplier">1 kilometer met</p>
                    <img src="img/tesla.jpg" alt="Phone Image" class="solarpanel">
                </div>
            </div>

            <div class="card">
                ${(this.energy >= (83.8 * 3600) ? "<b class='chargable-card'>🔋</b>" : "<b class='chargable-card'>🪫</b>")}
                <h2>Water koken</h2>
                <p>Het benodigde vermogen om <strong>1 liter water in 1 uur</strong> op te warmen <strong>van 20°C naar 80°C is ongeveer 0,0838 kW (83,8 watt)</strong>.<br>
                Wanneer we opwarmen met een <strong>niet specifiek temperatuurverschil</strong>, dan heb je voor <strong>elke graad Celsius temperatuurverschil, ongeveer 1,396 watt nodig om 1 liter water in 1 uur te verwarmen</strong>.</p>
                <div class="flex-center-container">
                    <p class="multiplier">17 X</p>
                    <img src="img/solarpanel.jpg" alt="Solarpanel Image" class="solarpanel">
                    <p class="equals">=</p>
                    <p class="multiplier">1 uur tot</p>
                    <img src="img/kokendwater.jpg" alt="Phone Image" class="solarpanel">
                </div>
            </div>
        </div>
        `;
    }
}

customElements.define('energy-voorwerp-overview', EnergyVoorwerpOverview);
