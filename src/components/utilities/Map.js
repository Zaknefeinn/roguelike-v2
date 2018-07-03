export const RandomTiles = arr => {
  let floors = arr;
  let randomTiles = [];
  for (let i = 0; i < 15; i++) {
    const randomLocation = Math.floor(Math.random() * floors.length);
    randomTiles.push(floors[randomLocation]);
    floors.splice(randomLocation, 1);
  }
  return randomTiles;
};

export const LocateCell = (map, cell) => {
  const mapIndex = map.findIndex(
    coord => coord.x === cell.x && coord.y === cell.y
  );
  return mapIndex;
};
