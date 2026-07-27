const OrderQueue = (() => {
  const QUEUE_KEY = "yasou_order_queue";
  const listeners = new Set();

  function load() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    notify(queue.length);
  }

  function notify(count) {
    listeners.forEach(listener => listener(count));
  }

  function subscribe(listener) {
    listeners.add(listener);
    listener(load().length);
    return () => listeners.delete(listener);
  }

  function add(order) {
    const queue = load();
    queue.push(order);
    save(queue);
  }

  async function flush(sendOne) {
    const queue = load();
    if (queue.length === 0) return { sent: 0, pending: 0 };

    const stillPending = [];
    let sent = 0;

    for (const order of queue) {
      try {
        await sendOne(order);
        sent += 1;
      } catch (err) {
        stillPending.push(order);
      }
    }

    save(stillPending);
    return { sent, pending: stillPending.length };
  }

  return {
    load,
    save,
    add,
    flush,
    subscribe
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = OrderQueue;
}
