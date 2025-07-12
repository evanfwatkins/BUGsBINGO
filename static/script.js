let socket;

function joinGame() {
    let socket;

    const username = document.getElementById('username').value;
    if (!username) return alert('Enter a name first');
    socket = io();

    socket.emit('join', { username });

    socket.on('joined', data => {
        document.getElementById('game').style.display = 'block';
        document.getElementById('welcome').innerText = data.message;
        createBingoCard(); // ← generate bingo card on join
    });

    socket.on('number_drawn', data => {
        addNumberToList(data.number);
        highlightBingoCell(data.number);
        console.log("balls");

    });

    socket.on('bingo_announcement', data => {
        const div = document.getElementById('messages');
        div.innerHTML += `<p><strong>${data.username}</strong> claims BINGO!</p>`;
    });

    socket.on('left', data => {
        const div = document.getElementById('messages');
        div.innerHTML += `<p>${data.message}</p>`;
    });
}

function drawNumber() {
    socket = io();
    if (typeof socket === 'undefined') {
    alert("You must join the game first!");
    return;
  }
  socket.emit('draw');
}




function claimBingo() {
  const username = document.getElementById('username').value;
  socket.emit('bingo_claim', { username });
}

function addNumberToList(number) {
  const ul = document.getElementById('numbers');
  const li = document.createElement('li');
  li.textContent = getRandomLetters() + '' + number;
  ul.appendChild(li);
}

// Bingo card logic
function createBingoCard() {
  const gameDiv = document.getElementById('game');

  const bingoContainer = document.createElement('div');
  bingoContainer.id = 'bingo-container';
  bingoContainer.style.marginTop = '20px';

  const title = document.createElement('h3');
  title.innerText = "Your Bingo Card";
  bingoContainer.appendChild(title);

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(5, 60px)';
  grid.style.gridGap = '5px';
  grid.id = 'bingo-grid';

  const columns = {
    B: getRandomNumbers(1, 15, 5),
    I: getRandomNumbers(16, 30, 5),
    N: getRandomNumbers(31, 45, 5),
    G: getRandomNumbers(46, 60, 5),
    O: getRandomNumbers(61, 75, 5),
  };

  const headers = ['B', 'I', 'N', 'G', 'O'];
  headers.forEach(letter => {
    const cell = document.createElement('div');
    cell.innerText = letter;
    cell.style.fontWeight = 'bold';
    cell.style.textAlign = 'center';
    cell.style.border = '1px solid black';
    cell.style.padding = '8px';
    grid.appendChild(cell);
  });

  for (let i = 0; i < 5; i++) {
    headers.forEach((letter, col) => {
      const cell = document.createElement('div');
      let num = columns[letter][i];
      if (letter === 'N' && i === 2) {
        cell.innerText = '★';
        cell.dataset.free = true;
      } else {
        cell.innerText = num;
        cell.dataset.number = num;
      }
      cell.style.textAlign = 'center';
      cell.style.border = '1px solid black';
      cell.style.padding = '8px';
      cell.style.backgroundColor = '#f0f0f0';
      grid.appendChild(cell);
    });
  }

  bingoContainer.appendChild(grid);
  gameDiv.appendChild(bingoContainer);
}

function highlightBingoCell(number) {
  const grid = document.getElementById('bingo-grid');
  const cells = grid.querySelectorAll('div');
  cells.forEach(cell => {
    if (cell.dataset.number == number) {
      cell.style.backgroundColor = '#90ee90';
    }
  });
}

function getRandomLetters() {
  const letters = ["B", "I", "N", "G", "O"];
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  console.log(randomLetter);
  return randomLetter;
}

function getRandomNumbers(min, max, count) {
  const nums = [];
  while (nums.length < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!nums.includes(num)) nums.push(num);
  }
  return nums;
}

function claimBingo() {
  const username = document.getElementById('username').value;
  socket.emit('bingo_claim', { username });
}