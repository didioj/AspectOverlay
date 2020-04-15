from flask import Flask, render_template, request
import requests

app = Flask(__name__, template_folder='.')

@app.route('/index.html', methods=['GET'])
def index():
   return render_template('index.html')

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
            data = {'moves':' '.join(request.json['moves'])},
            headers = {'content-type':'application/json'}
         )
   if (res.status_code != requests.codes.ok):
      return {'error': 'The list of moves must only contain "left", "down", "stand", "up", or "right"'}
      print('There was an error sending moves to the game')
   print('Sent moves to Unity')
   return {}

if __name__ == '__main__':
   app.run()