const appState = {
  view: "tables",
  lang: "he",
  publicCategory: "all",
  orderCategory: MENU_DATA.categories[0].id,
  station: "all",
  activeTable: null,
  cart: [],
  orders: [],
  tableStates: JSON.parse(localStorage.getItem("yasou_spa_table_states") || "{}")
};

const zoneMeta = {
  outside: { title: "מתחם חיצוני", sub: "25-34", className: "outside" },
  covered: { title: "מתחם מקורה", sub: "18-24", className: "covered" },
  inside: { title: "מתחם פנימי", sub: "1-17", className: "inside" }
};

const stationLabels = {
  hot: "מטבח חם",
  cold: "מטבח קר",
  bar: "בר"
};

let toastTimer;

function saveTableStates() {
  localStorage.setItem("yasou_spa_table_states", JSON.stringify(appState.tableStates));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setView(view) {
  appState.view = view;
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
  document.querySelectorAll("[data-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  document.getElementById("side").classList.remove("open");
  document.getElementById("screenShade").classList.remove("open");

  if (view === "kitchen") loadKitchenOrders();
  if (view === "active") renderActiveOrders();
  updateNotice();
}

function updateNotice() {
  const title = document.getElementById("noticeTitle");
  const text = document.getElementById("noticeText");
  if (appState.view === "tables") {
    title.textContent = "ניהול שולחנות";
    text.textContent = "בחר שולחן כדי לפתוח הזמנה חדשה.";
  } else if (appState.view === "menu") {
    title.textContent = "תפריט לקוחות";
    text.textContent = "תצוגה ציבורית בשלוש שפות.";
  } else if (appState.view === "active") {
    title.textContent = "הזמנות פעילות";
    text.textContent = "כאן המלצר חוזר לשולחנות שכבר פתוחים.";
  } else {
    title.textContent = "קופה / מטבח";
    text.textContent = "הזמנות פתוחות מתעדכנות מהגיליון.";
  }
}

function getTableStatus(tableId) {
  return appState.tableStates[tableId]?.status || "free";
}

function getTableTotal(tableId) {
  return appState.tableStates[tableId]?.total || 0;
}

function activeTableEntries() {
  return Object.entries(appState.tableStates)
    .map(([tableId, data]) => ({ tableId: Number(tableId), ...data }))
    .filter(entry => entry.status === "reserved" || entry.status === "occupied")
    .sort((a, b) => a.tableId - b.tableId);
}

function renderTables() {
  const board = document.getElementById("tableZones");
  board.innerHTML = "";

  renderOutsideZone(board);
  renderCoveredZone(board);
  renderInsideZone(board);
}

function makeZone(zone, content) {
  const meta = zoneMeta[zone];
  const section = document.createElement("section");
  section.className = `zone-card ${meta.className}`;
  section.innerHTML = `
    <div class="zone-head">
      <h2>${meta.title}</h2>
      <span>${meta.sub}</span>
    </div>
  `;
  section.appendChild(content);
  return section;
}

function renderOutsideZone(board) {
  const grid = document.createElement("div");
  grid.className = "table-grid outside";
  [32, 31, 29, 26, 25, 34, 33, 30, 28, 27].forEach(id => grid.appendChild(tableButton(id)));
  board.appendChild(makeZone("outside", grid));
}

function renderCoveredZone(board) {
  const wrap = document.createElement("div");
  const top = document.createElement("div");
  top.className = "table-grid covered-top";
  [24, 23, 22, 21].forEach(id => top.appendChild(tableButton(id, { wide: true })));
  const bottom = document.createElement("div");
  bottom.className = "table-grid covered-bottom";
  [20, 19, 18].forEach(id => bottom.appendChild(tableButton(id, { wide: id !== 19, circle: id === 19 })));
  wrap.append(top, bottom);
  board.appendChild(makeZone("covered", wrap));
}

function renderInsideZone(board) {
  const grid = document.createElement("div");
  grid.className = "table-grid inside";
  [[17, 16, 15], [14, 13, 12, 11], [10, 9, 8], [7, 6, 5], [4, 3, 2, 1]].forEach(col => {
    const colEl = document.createElement("div");
    colEl.className = "inside-col";
    col.forEach(id => colEl.appendChild(tableButton(id, { small: [8, 15, 16, 17].includes(id) })));
    grid.appendChild(colEl);
  });
  board.appendChild(makeZone("inside", grid));
}

function tableButton(id, options = {}) {
  const def = TABLE_BLUEPRINT.find(table => table.id === id);
  const status = getTableStatus(id);
  const btn = document.createElement("button");
  btn.className = `table-tile ${status} ${options.small ? "small" : ""} ${options.wide ? "wide" : ""} ${options.circle ? "circle" : ""}`;
  btn.type = "button";
  btn.innerHTML = `
    <span class="table-id">${id}</span>
    <span class="table-seats">${def?.seats || ""}</span>
    ${status !== "free" ? `<span class="table-state">${status === "reserved" ? "שמור" : getTableTotal(id) + "€"}</span>` : ""}
  `;
  btn.onclick = () => openOrder(id);
  return btn;
}

function openOrder(tableId) {
  appState.activeTable = tableId;
  appState.cart = structuredClone(appState.tableStates[tableId]?.items || []);
  appState.orderCategory = MENU_DATA.categories[0].id;
  document.getElementById("orderTableNumber").textContent = "#" + tableId;
  document.getElementById("orderTitle").textContent = `שולחן ${tableId}`;
  document.getElementById("orderSubtitle").textContent = `${TABLE_BLUEPRINT.find(t => t.id === tableId)?.seats || ""} מקומות`;
  document.getElementById("searchInput").value = "";
  document.getElementById("orderModal").classList.add("open");
  renderOrderCategories();
  renderOrderItems();
  renderCart();
}

function closeOrder() {
  document.getElementById("orderModal").classList.remove("open");
}

function renderOrderCategories() {
  const el = document.getElementById("orderCategories");
  el.innerHTML = "";
  MENU_DATA.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = cat.id === appState.orderCategory ? "active" : "";
    btn.textContent = cat.name.he;
    btn.onclick = () => {
      appState.orderCategory = cat.id;
      renderOrderCategories();
      renderOrderItems();
    };
    el.appendChild(btn);
  });
}

function renderOrderItems() {
  const grid = document.getElementById("orderItems");
  const search = document.getElementById("searchInput").value.trim();
  grid.innerHTML = "";

  MENU_DATA.items
    .filter(item => item.category === appState.orderCategory)
    .filter(item => !search || item.name.he.includes(search) || item.name.en.toLowerCase().includes(search.toLowerCase()))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "order-item";
      card.innerHTML = `
        <div>
          <strong>${item.name.he}</strong>
          <span>${priceLabel(item)}</span>
        </div>
        <button class="add-btn" type="button">הוסף</button>
      `;
      card.querySelector("button").onclick = () => addItem(item);
      grid.appendChild(card);
    });
}

function priceLabel(item) {
  if (item.price !== null) return item.price + "€";
  return item.variants.map(v => `${v.label.he} ${v.price}€`).join(" / ");
}

function addItem(item) {
  const variant = item.variants ? item.variants[0] : null;
  const unitPrice = variant ? variant.price : item.price;
  const variantLabel = variant ? variant.label.he : null;
  const lineKey = item.id + "::" + (variantLabel || "");
  const existing = appState.cart.find(line => line.lineKey === lineKey);

  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({
      lineId: Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      lineKey,
      itemId: item.id,
      station: item.station,
      name: item.name.he,
      unitPrice,
      qty: 1,
      note: "",
      variantLabel
    });
  }

  renderCart();
}

function cartTotal() {
  return appState.cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
}

function cartCount() {
  return appState.cart.reduce((sum, line) => sum + line.qty, 0);
}

function renderCart() {
  const lines = document.getElementById("cartLines");
  lines.innerHTML = "";
  document.getElementById("cartCount").textContent = cartCount() + " פריטים";
  document.getElementById("cartTotal").textContent = cartTotal() + "€";
  document.getElementById("sendButton").disabled = appState.cart.length === 0;

  if (appState.cart.length === 0) {
    lines.innerHTML = `<div class="empty">עדיין אין מנות בהזמנה</div>`;
    return;
  }

  appState.cart.forEach(line => {
    const row = document.createElement("div");
    row.className = "cart-line";
    const variant = line.variantLabel ? ` (${line.variantLabel})` : "";
    row.innerHTML = `
      <div class="cart-line-top">
        <span>${line.qty}x ${line.name}${variant}</span>
        <span>${line.qty * line.unitPrice}€</span>
      </div>
      <div class="qty-row">
        <button type="button" data-delta="-1">−</button>
        <button type="button" data-delta="1">+</button>
        <input type="text" value="${line.note || ""}" placeholder="הערה">
      </div>
    `;
    row.querySelector('[data-delta="-1"]').onclick = () => changeLineQty(line.lineId, -1);
    row.querySelector('[data-delta="1"]').onclick = () => changeLineQty(line.lineId, 1);
    row.querySelector("input").oninput = event => {
      line.note = event.target.value;
    };
    lines.appendChild(row);
  });
}

function changeLineQty(lineId, delta) {
  const line = appState.cart.find(item => item.lineId === lineId);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    appState.cart = appState.cart.filter(item => item.lineId !== lineId);
  }
  renderCart();
}

function reserveTable() {
  if (!appState.activeTable) return;
  appState.tableStates[appState.activeTable] = {
    status: "reserved",
    items: appState.cart,
    total: cartTotal(),
    updatedAt: new Date().toISOString()
  };
  saveTableStates();
  renderTables();
  renderActiveOrders();
  closeOrder();
  showToast("השולחן סומן כשמור");
}

async function sendOrder() {
  if (!appState.activeTable || appState.cart.length === 0) return;
  const table = appState.activeTable;
  const order = {
    orderId: "ord_" + table + "_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    table,
    items: appState.cart,
    total: cartTotal(),
    timestamp: new Date().toISOString(),
    status: "חדש"
  };

  OrderQueue.add(order);
  appState.tableStates[table] = {
    status: "occupied",
    items: appState.cart,
    total: cartTotal(),
    updatedAt: new Date().toISOString()
  };
  saveTableStates();
  renderTables();
  renderActiveOrders();
  closeOrder();
  showToast("ההזמנה נשמרה ונשלחת למטבח");
  await OrderQueue.flush(YASOU_API.submitOrder);
}

function closeTable(tableId) {
  delete appState.tableStates[tableId];
  saveTableStates();
  renderTables();
  renderActiveOrders();
  showToast(`שולחן ${tableId} נסגר`);
}

function renderActiveOrders() {
  const grid = document.getElementById("activeOrdersGrid");
  if (!grid) return;
  const entries = activeTableEntries();
  grid.innerHTML = "";

  if (entries.length === 0) {
    grid.innerHTML = `<div class="empty">אין כרגע הזמנות פעילות</div>`;
    return;
  }

  entries.forEach(entry => {
    const items = entry.items || [];
    const card = document.createElement("article");
    card.className = `active-order-card ${entry.status}`;
    card.innerHTML = `
      <div class="active-order-top">
        <div>
          <h3>שולחן ${entry.tableId}</h3>
          <p>${items.length} שורות · ${entry.total || 0}€ · ${formatTime(entry.updatedAt)}</p>
        </div>
        <span class="active-status ${entry.status}">${entry.status === "reserved" ? "שמור" : "תפוס"}</span>
      </div>
      <ul class="active-order-lines">
        ${items.slice(0, 5).map(item => `<li><span>${item.qty}x ${item.name}${item.variantLabel ? " (" + item.variantLabel + ")" : ""}</span><strong>${item.qty * item.unitPrice}€</strong></li>`).join("")}
        ${items.length > 5 ? `<li><span>ועוד ${items.length - 5} שורות...</span><strong></strong></li>` : ""}
      </ul>
      <div class="active-order-actions">
        <button class="dark-action" type="button" data-open="${entry.tableId}">פתח הזמנה</button>
        <button class="danger-action" type="button" data-close="${entry.tableId}">סגור שולחן</button>
      </div>
    `;
    card.querySelector("[data-open]").onclick = () => openOrder(entry.tableId);
    card.querySelector("[data-close]").onclick = () => closeTable(entry.tableId);
    grid.appendChild(card);
  });
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function renderPublicMenu() {
  renderPublicCategories();
  const grid = document.getElementById("menuCards");
  const menuView = document.getElementById("view-menu");
  grid.innerHTML = "";
  menuView.dir = appState.lang === "he" ? "rtl" : "ltr";
  menuView.lang = appState.lang === "gr" ? "el" : appState.lang;

  MENU_DATA.items
    .filter(item => appState.publicCategory === "all" || item.category === appState.publicCategory)
    .forEach(item => {
      const card = document.createElement("article");
      card.className = "dish-card";
      card.innerHTML = `
        <span class="price">${priceLabel(item)}</span>
        <h3>${item.name[appState.lang] || item.name.he}</h3>
        <p>${item.name.en || ""}</p>
      `;
      grid.appendChild(card);
    });
}

function renderPublicCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";
  const all = document.createElement("button");
  all.className = appState.publicCategory === "all" ? "active" : "";
  all.textContent = appState.lang === "he" ? "הכול" : appState.lang === "gr" ? "Όλα" : "All";
  all.onclick = () => {
    appState.publicCategory = "all";
    renderPublicMenu();
  };
  list.appendChild(all);

  MENU_DATA.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = appState.publicCategory === cat.id ? "active" : "";
    btn.textContent = cat.name[appState.lang] || cat.name.he;
    btn.onclick = () => {
      appState.publicCategory = cat.id;
      renderPublicMenu();
    };
    list.appendChild(btn);
  });
}

async function loadKitchenOrders() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = `<div class="empty">טוען הזמנות...</div>`;
  try {
    appState.orders = await YASOU_API.fetchOrders();
  } catch (err) {
    grid.innerHTML = `<div class="empty">לא ניתן לטעון הזמנות כרגע</div>`;
    return;
  }
  renderKitchen();
}

function renderKitchen() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = "";
  const visible = appState.orders
    .filter(order => order.status !== "בוצע")
    .map(order => ({ ...order, items: (order.items || []).filter(item => appState.station === "all" || item.station === appState.station) }))
    .filter(order => order.items.length > 0)
    .reverse();

  if (visible.length === 0) {
    grid.innerHTML = `<div class="empty">אין הזמנות פתוחות לתצוגה</div>`;
    return;
  }

  visible.forEach(order => {
    const card = document.createElement("article");
    card.className = "order-card";
    card.innerHTML = `
      <h3>שולחן ${order.table}</h3>
      <ul>
        ${order.items.map(item => `<li><strong>${item.qty}x ${item.name}</strong>${item.variantLabel ? " - " + item.variantLabel : ""}${item.note ? "<br>" + item.note : ""}</li>`).join("")}
      </ul>
      <button class="dark-action" type="button">סמן כבוצע</button>
    `;
    card.querySelector("button").onclick = async () => {
      await YASOU_API.updateOrderStatus(order.orderId, "בוצע");
      appState.orders = appState.orders.map(item => item.orderId === order.orderId ? { ...item, status: "בוצע" } : item);
      renderKitchen();
      showToast("ההזמנה סומנה כבוצעה");
    };
    grid.appendChild(card);
  });
}

document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

document.querySelectorAll("[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    appState.lang = btn.dataset.lang;
    document.querySelectorAll("[data-lang]").forEach(item => item.classList.toggle("active", item === btn));
    renderPublicMenu();
  });
});

document.querySelectorAll("[data-station]").forEach(btn => {
  btn.addEventListener("click", () => {
    appState.station = btn.dataset.station;
    document.querySelectorAll("[data-station]").forEach(item => item.classList.toggle("active", item === btn));
    renderKitchen();
  });
});

document.getElementById("hamburger").onclick = () => {
  document.getElementById("side").classList.add("open");
  document.getElementById("screenShade").classList.add("open");
};
document.getElementById("screenShade").onclick = () => {
  document.getElementById("side").classList.remove("open");
  document.getElementById("screenShade").classList.remove("open");
};
document.getElementById("refreshButton").onclick = () => {
  if (appState.view === "kitchen") {
    loadKitchenOrders();
  } else if (appState.view === "active") {
    renderActiveOrders();
    showToast("רשימת ההזמנות עודכנה");
  } else {
    showToast("המסך עודכן");
  }
};
document.getElementById("searchInput").oninput = renderOrderItems;
document.getElementById("sendButton").onclick = sendOrder;
document.getElementById("reserveButton").onclick = reserveTable;

window.addEventListener("online", () => OrderQueue.flush(YASOU_API.submitOrder));
setInterval(() => OrderQueue.flush(YASOU_API.submitOrder), 15000);

renderTables();
renderActiveOrders();
renderPublicMenu();
updateNotice();
OrderQueue.flush(YASOU_API.submitOrder);
