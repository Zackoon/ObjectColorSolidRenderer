from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/ocs/helloworld') # ‘https://www.google.com/‘
def hello_world():
	return jsonify(message="Hello, world!")

app.run(port=5000)