class EventBus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  parseEventName(eventName) {
    const parts = eventName.split(":");
    if (parts.length === 2) {
      return { group: parts[0], event: parts[1] };
    }
    return { group: "default", event: eventName };
  }

  removeGroup(groupName) {
    const eventsToRemove = [];

    Object.keys(this._events || {}).forEach((eventName) => {
      const { group } = this.parseEventName(eventName);
      if (group === groupName) {
        eventsToRemove.push(eventName);
      }
    });

    eventsToRemove.forEach((eventName) => {
      this.removeAllListeners(eventName);
    });

    return this;
  }

  getGroups() {
    const groups = new Set();
    Object.keys(this._events || {}).forEach((eventName) => {
      const { group } = this.parseEventName(eventName);
      groups.add(group);
    });
    return Array.from(groups);
  }

  getGroupStats(groupName) {
    let count = 0;
    Object.keys(this._events || {}).forEach((eventName) => {
      const { group } = this.parseEventName(eventName);
      if (group === groupName) {
        const listeners = this._events[eventName];
        count += Array.isArray(listeners) ? listeners.length : 1;
      }
    });
    return count;
  }

  getStats() {
    const stats = {};
    this.getGroups().forEach((group) => {
      stats[group] = this.getGroupStats(group);
    });
    return stats;
  }

  clear() {
    this.removeAllListeners();
    return this;
  }
}

export const eventBus = new EventBus();