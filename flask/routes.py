from flask import Flask, render_template, request, abort
import requests

app = Flask(__name__, template_folder='.')

user_counter = 0
board = {}

@app.route('/', methods=['GET'])
@app.route('/index.html', methods=['GET'])
def index():
   return render_template('index.html')

@app.route('/api/send_name', methods=['POST'])
def register():
   global user_counter
   if not request.json or not 'userID' in request.json:
      abort(400)
   print('Sending UID to Unity')
   res = requests.post(
            'http://127.0.0.1:4000/register',
            data = {'userID':user_counter},
            headers = {'content-type':'application/json'}
         )
   if (res.status_code != requests.codes.ok):
      print('There was an error sending the user ID to the game')
      return {'error': 'The request did not reach Unity'}
   print('Registered player with Unity')
   user_counter += 1
   return {}

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
            'http://127.0.0.1:4000/move',
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
   global board
   if not request.form or not "map" in request.form.keys():
      abort(400)
   print('Updating minimap')
   board = request.form.get("map")
   return {}

@app.route('/api/get_minimap', methods=['GET'])
def get_minimap():
   global board
   return board

if __name__ == '__main__':
   app.run()