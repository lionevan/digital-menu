const SHEET_NAME = "Orders";
const HEADERS = [
  "orderId",
  "table",
  "itemsText",
  "itemsJson",
  "total",
  "createdAt",
  "status",
  "updatedAt"
];

function setup() {
  const sheet = ensureSheet();
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return submitOrder(data);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  try {
    const action = (e.parameter.action || "orders").toLowerCase();

    if (action === "submit") {
      const data = JSON.parse(e.parameter.data || "{}");
      return submitOrder(data);
    }

    if (action === "status") {
      return updateStatus(e.parameter.orderId, e.parameter.status || "בוצע");
    }

    return getOrders();
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function submitOrder(data) {
  if (!data.orderId) {
    return jsonResponse({ ok: false, error: "Missing orderId" });
  }

  const sheet = ensureSheet();

  if (orderAlreadyExists(data.orderId)) {
    return jsonResponse({ ok: true, duplicate: true, orderId: data.orderId });
  }

  const itemsText = (data.items || [])
    .map(item => {
      const variant = item.variantLabel ? " (" + item.variantLabel + ")" : "";
      const note = item.note ? " - " + item.note : "";
      return item.qty + "x " + item.name + variant + note;
    })
    .join("\n");

  sheet.appendRow([
    data.orderId,
    data.table,
    itemsText,
    JSON.stringify(data.items || []),
    data.total,
    data.timestamp ? new Date(data.timestamp) : new Date(),
    data.status || "חדש",
    new Date()
  ]);

  return jsonResponse({ ok: true, orderId: data.orderId });
}

function getOrders() {
  const sheet = ensureSheet();
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return jsonResponse({ ok: true, orders: [] });
  }

  const orders = values.slice(1).map(row => {
    let items = [];
    try {
      items = JSON.parse(row[3] || "[]");
    } catch (err) {
      items = [];
    }

    return {
      orderId: row[0],
      table: row[1],
      itemsText: row[2],
      items,
      total: row[4],
      createdAt: toIsoString(row[5]),
      status: row[6] || "חדש",
      updatedAt: toIsoString(row[7])
    };
  });

  return jsonResponse({ ok: true, orders });
}

function updateStatus(orderId, status) {
  if (!orderId) {
    return jsonResponse({ ok: false, error: "Missing orderId" });
  }

  const sheet = ensureSheet();
  const rowNumber = findOrderRow(orderId);
  if (!rowNumber) {
    return jsonResponse({ ok: false, error: "Order not found" });
  }

  sheet.getRange(rowNumber, 7).setValue(status);
  sheet.getRange(rowNumber, 8).setValue(new Date());
  return jsonResponse({ ok: true, orderId, status });
}

function orderAlreadyExists(orderId) {
  return Boolean(findOrderRow(orderId));
}

function findOrderRow(orderId) {
  const sheet = ensureSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const index = ids.indexOf(orderId);
  return index === -1 ? null : index + 2;
}

function ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function toIsoString(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
