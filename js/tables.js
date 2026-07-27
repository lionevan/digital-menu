const TABLE_BLUEPRINT = [
  { id: 1, seats: 4, zone: "inside", x: 10, y: 80, w: 74, h: 58 },
  { id: 2, seats: 4, zone: "inside", x: 10, y: 58, w: 74, h: 58 },
  { id: 3, seats: 4, zone: "inside", x: 10, y: 36, w: 74, h: 58 },
  { id: 4, seats: 4, zone: "inside", x: 10, y: 14, w: 74, h: 58 },
  { id: 5, seats: 4, zone: "inside", x: 34, y: 58, w: 74, h: 58 },
  { id: 6, seats: 4, zone: "inside", x: 34, y: 36, w: 74, h: 58 },
  { id: 7, seats: 6, zone: "inside", x: 34, y: 15, w: 112, h: 54 },
  { id: 8, seats: 2, zone: "inside", x: 56, y: 58, w: 58, h: 58 },
  { id: 9, seats: 4, zone: "inside", x: 56, y: 36, w: 74, h: 58 },
  { id: 10, seats: 4, zone: "inside", x: 56, y: 14, w: 74, h: 58 },
  { id: 11, seats: 4, zone: "inside", x: 78, y: 80, w: 74, h: 58 },
  { id: 12, seats: 4, zone: "inside", x: 78, y: 58, w: 74, h: 58 },
  { id: 13, seats: 4, zone: "inside", x: 78, y: 36, w: 74, h: 58 },
  { id: 14, seats: 4, zone: "inside", x: 78, y: 14, w: 74, h: 58 },
  { id: 15, seats: 2, zone: "inside", x: 94, y: 58, w: 58, h: 58 },
  { id: 16, seats: 2, zone: "inside", x: 94, y: 36, w: 58, h: 58 },
  { id: 17, seats: 2, zone: "inside", x: 94, y: 14, w: 58, h: 58 },
  { id: 18, seats: 6, zone: "covered", x: 11, y: 62, w: 90, h: 70 },
  { id: 19, seats: 10, zone: "covered", x: 50, y: 63, w: 132, h: 132, round: true },
  { id: 20, seats: 6, zone: "covered", x: 89, y: 62, w: 90, h: 70 },
  { id: 21, seats: 8, zone: "covered", x: 13, y: 25, w: 142, h: 62 },
  { id: 22, seats: 12, zone: "covered", x: 34, y: 25, w: 190, h: 62 },
  { id: 23, seats: 12, zone: "covered", x: 66, y: 25, w: 190, h: 62 },
  { id: 24, seats: 8, zone: "covered", x: 87, y: 25, w: 142, h: 62 },
  { id: 25, seats: 6, zone: "outside", x: 10, y: 28, w: 100, h: 60 },
  { id: 26, seats: 6, zone: "outside", x: 27, y: 28, w: 100, h: 60 },
  { id: 27, seats: 6, zone: "outside", x: 10, y: 74, w: 100, h: 60 },
  { id: 28, seats: 6, zone: "outside", x: 27, y: 74, w: 100, h: 60 },
  { id: 29, seats: 6, zone: "outside", x: 50, y: 28, w: 100, h: 60 },
  { id: 30, seats: 6, zone: "outside", x: 50, y: 74, w: 100, h: 60 },
  { id: 31, seats: 6, zone: "outside", x: 73, y: 28, w: 100, h: 60 },
  { id: 32, seats: 6, zone: "outside", x: 90, y: 28, w: 100, h: 60 },
  { id: 33, seats: 6, zone: "outside", x: 73, y: 74, w: 100, h: 60 },
  { id: 34, seats: 6, zone: "outside", x: 90, y: 74, w: 100, h: 60 }
];

const ZONE_TO_CONTAINER = {
  outside: "zone-outdoor",
  covered: "zone-covered",
  inside: "zone-indoor"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TABLE_BLUEPRINT, ZONE_TO_CONTAINER };
}
