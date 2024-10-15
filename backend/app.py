from flask import Flask
from flask_cors import CORS
from routes import teapot_routes, ocs_routes, file_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(teapot_routes)
    app.register_blueprint(ocs_routes)
    app.register_blueprint(file_routes)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)