from flask import Flask, render_template
from prediction import Prediction

app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/update")
def update():
	prediction.update_model()
	return render_template('update.html')

@app.route("/predict/<country>")
def predict(country):
	result = prediction.get_prediction(country)
	return result

if __name__ == "__main__":
	prediction = Prediction()
	app.run(debug=True)