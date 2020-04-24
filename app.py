from flask import Flask, render_template, jsonify
from prediction import Prediction

app = Flask(__name__)

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/update")
def update():
	prediction_confirmed.update_model()
	prediction_deaths.update_model()
	prediction_recovered.update_model()
	return jsonify(success=True)

@app.route("/predict/<country>")
def predict(country):
	result_confirmed = prediction_confirmed.get_prediction(country)
	result_deaths = prediction_deaths.get_prediction(country)
	result_recovered = prediction_recovered.get_prediction(country)
	return {'confirmed': result_confirmed, 'deaths': result_deaths, 'recovered': result_recovered}

if __name__ == "__main__":
	confirmed_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
	deaths_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
	recovered_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'

	prediction_confirmed = Prediction(url=confirmed_url, pred_type='confirmed')
	prediction_deaths = Prediction(url=deaths_url, pred_type='deaths')
	prediction_recovered = Prediction(url=recovered_url, pred_type='recovered')
	app.run(debug=False)