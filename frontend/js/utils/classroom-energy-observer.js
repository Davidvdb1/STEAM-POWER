class ClassroomEnergyObserver {

  constructor() {
    this.value = 0.00;
    this.subscribtions = new Map();
    this.cbFetchEnergy = async () => {};

    this.fetchEnergy = async () => {
      const response = await this.cbFetchEnergy();
      if (response && response.status === 200) {
        const resData = await response.json();
        this.value = resData.energy_watt;
        this.notify();
      }
    }
    setInterval(this.fetchEnergy, 5000);
  }

  notify() {
    this.subscribtions.forEach((cb) => {
      cb(this.value);
    })
  }
  subscribe(sub) {
    this.subscribtions.set(sub.name, sub.cb);
    this.fetchEnergy();
  }

  // setter for the energy fetch service method;
  // because can't import the service method directly inside a "javascript/text" type script
  // this needs to be set to get the correct values from notify method
  setFetchEnergy(cb) {
    this.cbFetchEnergy = cb;
  }
}

let classroomEnergyObserver = new ClassroomEnergyObserver();
