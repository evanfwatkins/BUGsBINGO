from flask import Flask, render_template, request
from flask import SocketIO, emit, join_room
import eventlet
import random

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

players = {}
bingo_numbers = list(range(1, 76))
drawn_numbers = []

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def handle_join(data):
    username = data['username']
    players[request.sid] = {'username': username}
    join_room('bingo')
    emit('joined', {'message': f"{username} joined the game!"}, room='bingo')

@socketio.on('draw')
def handle_draw():
    if len(drawn_numbers) < 75:
        num = random.choice([n for n in bingo_numbers if n not in drawn_numbers])
        drawn_numbers.append(num)
        emit('number_drawn', {'number': num}, room='bingo')

@socketio.on('bingo_claim')
def handle_bingo_claim(data):
    emit('bingo_announcement', {'username': data['username']}, room='bingo')

@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in players:
        emit('left', {'message': f"{players[request.sid]['username']} left."}, room='bingo')
        del players[request.sid]

if __name__ == '__main__':
    # 0.0.0.0 lets others on LAN connect via your IP
    socketio.run(app, host='0.0.0.0', port=5000)
