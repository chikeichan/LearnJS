var field = makeMinesField(7, 7, 10);
var rootElement = document.querySelector('#root');

renderMinesField();

function renderMinesField() {
  rootElement.innerHTML = '';

  field.forEach(function(row) {
    var rowElement = document.createElement('div');
    rowElement.className = 'minesweeper-row';
    row.forEach(function(cell) {
      var cellElement = document.createElement('button');
      var cellType = cell.isMine ? 'M' : cell.value;

      if (cell.isFlagged) {
        cellElement.className = 'minesweeper-cell__flagged minesweeper-cell';
      } else if (cell.isOpen) {
        cellElement.textContent = cell.isMine || cell.value < 1 ? '' : cell.value;
        cellElement.className = 'minesweeper-cell minesweeper-cell__clicked minesweeper-cell' + (cellType ? '--' + cellType : '');
      } else {
        cellElement.className = 'minesweeper-cell__closed minesweeper-cell';
      }

      cellElement.addEventListener('click', function(e) {
        if (cell.isFlagged || cell.isOpen) {
          return;
        }

        spread(cell);
        renderMinesField();

        if (cell.isMine) {
          console.log('you lose');
          cell.isOpen = true;
          renderMinesField();
        }
      });

      cellElement.addEventListener('contextmenu', function(e) {
          if (cell.isOpen) {
            return;
          }
          cell.isFlagged = !cell.isFlagged;
          e.preventDefault();
          cellElement.className = cell.isFlagged && 'minesweeper-cell__flagged  minesweeper-cell';
          renderMinesField();
      });

      rowElement.appendChild(cellElement);
    });

    rootElement.appendChild(rowElement);
  });
}

function spread(cell) {
  if (!cell || cell.isMine || cell.isOpen) {
    return;
  }

  cell.isOpen = true;

  if (cell.value >= 1) {
    return;
  }

  var row = cell.row;
  var col = cell.col;
  var east, west, north, south, northeast, northwest, southeast, southwest;

  if (field[row - 1]) {
    north = field[row - 1][col];
    northeast = field[row - 1][col + 1];
    northwest = field[row - 1][col - 1];
  }

  if (field[row + 1]) {
    southeast = field[row + 1][col + 1];
    south = field[row + 1][col];
    southwest = field[row + 1][col - 1];
  }

  west = field[row][col - 1];
  east = field[row][col + 1];

  [east, west, north, south, northeast, northwest, southeast, southwest].forEach(spread);
}

function makeMinesField(x, y, numberOfMines) {
  var flattenMinesField = makeFlattenMinesField(x, y, numberOfMines);
  var field = [];

  for (var i = 0; i < x; i++) {
    var row = [];
    for (var j = 0; j < y; j++) {
      var cell = flattenMinesField[i * y + j];
      row.push(cell);
    }
    field.push(row);
  }

  return setMarkersOnField(field);;
}

function makeFlattenMinesField(x, y, numOfMines) {
  var flattenMinesField = new Array(x * y);
  for (var i = 0; i < numOfMines; i++) {
    flattenMinesField[i] = makeCell(true);
  }

  return shuffle(flattenMinesField);

  function shuffle(array) {
    var len = array.length;
    array.forEach(function(n, i) {
      var rand = Math.floor(Math.random() * len);
      swap(array, i, rand);
    });
    return array;
  }

  function swap(array, x, y) {
    var tmp = array[x];
    array[x] = array[y];
    array[y] = tmp;
  }

}

function setMarkersOnField(field) {
  field.forEach(function(row, i) {
    row.forEach(function(cell, j) {
      var totalSurroundingBombs = findSurroundingBombsAtCell(i, j, field);
      row[j] = totalSurroundingBombs;
      row[j].row = i;
      row[j].col = j;
    });
  });

  return field;

  function findSurroundingBombsAtCell(row, col, field) {
    var cell = field[row][col] || this.makeCell();

    var east, west, north, south, northeast, northwest, southeast, southwest;

    if (cell.isMine) {
      cell.value = null;
    } else {
      if (field[row - 1]) {
        north = field[row - 1][col];
        northeast = field[row - 1][col + 1];
        northwest = field[row - 1][col - 1];
      }

      if (field[row + 1]) {
        southeast = field[row + 1][col + 1];
        south = field[row + 1][col];
        southwest = field[row + 1][col - 1];
      }

      west = field[row][col - 1];
      east = field[row][col + 1];

      cell.value = [east, west, north, south, northeast, northwest, southeast, southwest]
        .reduce(function(acc, n) {
          return acc + (n && n.isMine ? 1 : 0);
        }, 0);
    }

    return cell;
  }
}

function makeCell(isMine) {
  return {
    isMine: isMine,
    isOpen: false,
    value: null
  };
}
