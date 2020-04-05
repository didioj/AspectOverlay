from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
   return render_template('index.html')

@app.route('/api/send_move', methods=['POST'])
def send_move():
   if not request.json or not 'direction' in request.json:
      abort(400)
   res = requests.post('http://localhost:4000', data = {'direction':request.json['direction']})
   ret = {'status': True}
   if (res.status_code != requests.codes.ok):
      print('There was an error sending a move to the game')
      print(res)
      ret['status'] = False
   return ret

if __name__ == '__main__':
   app.run()