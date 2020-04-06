from flask import Flask, render_template, request
import requests

app = Flask(__name__, template_folder='.')

@app.route('/', methods=['GET'])
def index():
   return render_template('index.html')

@app.route('/api/send_move', methods=['POST'])
def send_move():
   if not request.json or not 'moves' in request.json:
      abort(400)
   res = requests.post(
            'http://127.0.0.1:4000/',
            data = {'moves':' '.join(request.json['moves'])},
            headers = {'content-type':'application/json'}
         )
   if (res.status_code != requests.codes.ok):
      print('There was an error sending moves to the game')
   else:
      print('Sent moves to the game')
   return {}

if __name__ == '__main__':
   app.run()