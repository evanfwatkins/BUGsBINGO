let socket;
function joinGame() {
  const username = document.getElementById('username').value;
  if (!username) return alert('Enter a name first');
  socket = io();

  socket.emit('join', { username });

  socket.on('joined', data => {
    document.getElementById('game').style.display = 'block';
    document.getElementById('welcome').innerText = data.message;
  });

  socket.on('number_drawn', data => {
    const ul = document.getElementById('numbers');
    const li = document.createElement('li');
    li.textContent = data.number;
    ul.appendChild(li);
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
  socket.emit('draw');
}

function claimBingo() {
  const username = document.getElementById('username').value;
  socket.emit('bingo_claim', { username });
}