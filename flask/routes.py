from flask import Flask, render_template, request
import requests

app = Flask(__name__, template_folder='.')

user_counter = 0
board = []

@app.route('/', methods=['GET'])
@app.route('/index.html', methods=['GET'])
def index():
   return render_template('index.html')

@app.route('/api/send_name', methods=['POST'])
def register():
   if not request.json or not 'userID' in request.json:
      abort(400)
   print('Sending UID to Unity')
   res = requests.post(
            'http://127.0.0.1:4000/',
            data = {'userID':user_counter},
            headers = {'content-type':'application/json'}
         )
   if (res.status_code != requests.codes.ok):
      print('There was an error sending the user ID to the game')
      return {'error': 'The request did not reach Unity'}
   print('Registered player with Unity')
   if res.content['accepted']:
      user_counter += 1
   return {'accepted': res.content['accepted'], 'id': user_counter, 'turnTime': res.content['turnTime']}

@app.route('/api/send_move', methods=['POST'])
def send_move():
   if not request.json or not 'moves' in request.json:
      abort(400)
   moves = request.json['moves']
   if (len(moves) != 5):
      return {'error': 'The list of moves must be 5 long'}
   filter(lambda x: x in ['left', 'down', 'stand', 'up', 'right'], moves)
   if (len(moves) != 5):
      return {'error': 'The list of moves must only contain "left", "down", "stand", "up", or "right"'}
   print('Sending moves to Unity')
   res = requests.post(
            'http://127.0.0.1:4000/',
            data = {'userID':request.json['userID'], 'moves':' '.join(request.json['moves'])},
            headers = {'content-type':'application/json'}
         )
   if (res.status_code != requests.codes.ok):
      print('There was an error sending moves to the game')
      return {'error': 'The list of moves must only contain "left", "down", "stand", "up", or "right"'}
   print('Sent moves to Unity')
   return {}

@app.route('/api/update_minimap', methods=['POST'])
def update_minimap():
   if not request.json or not 'map' in request.json:
      abort(400)
   print('Updating minimap')
   board = requst.json['map']
   return {}

if __name__ == '__main__':
   app.run()