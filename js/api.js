const YASOU_API = (() => {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvyZluQUVM1FwM8a5LV9es8Y4ir7fV3HCSF8nyvUks49QSot1f7Qz_6HEbzXmgiNQ6/exec";

  function buildUrl(action, payload) {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", action);
    if (payload) {
      url.searchParams.set("data", JSON.stringify(payload));
    }
    return url.toString();
  }

  async function submitOrder(order) {
    await fetch(buildUrl("submit", order), { method: "GET", mode: "no-cors" });
    return true;
  }

  async function fetchOrders() {
    const response = await fetch(buildUrl("orders"), { method: "GET" });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || "Could not load orders");
    }
    return data.orders || [];
  }

  async function updateOrderStatus(orderId, status) {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set("action", "status");
    url.searchParams.set("orderId", orderId);
    url.searchParams.set("status", status);
    await fetch(url.toString(), { method: "GET", mode: "no-cors" });
    return true;
  }

  return {
    submitOrder,
    fetchOrders,
    updateOrderStatus
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = YASOU_API;
}
