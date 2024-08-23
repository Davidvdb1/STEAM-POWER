class CleanupHandler {
  constructor() {
    this.cleanupCbs = [];
  }

  register(cb) {
    this.cleanupCbs.push(cb);
  }
  clear() {
    this.cleanupCbs.forEach((cb) => {
      cb();
    });
    this.cleanupCbs = [];
  }
}

let cleanupHandler = new CleanupHandler();
window.cleanupHandler = cleanupHandler;
console.log('cleanupHandler.js loaded');
