from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/ocs/helloworld', methods=['GET']) # ‘https://www.google.com/‘
def hello_world():
	return jsonify(message="Hello, world!")

@app.route('/ocs/range', methods=['GET']) # ‘https://www.google.com/‘
def get_range():
	start = request.args.get('start')
	end = request.args.get('end')
	
	return jsonify(message=list(range(int(start), int(end))))

app.run(port=5000)