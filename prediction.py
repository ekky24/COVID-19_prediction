import pandas as pd
import numpy as np
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
import pickle
import os

from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import RandomizedSearchCV, GridSearchCV, train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error

class Prediction:
	def __init__(self, future_dates=14):
		self.future_dates = future_dates

		confirmed_raw = pd.read_csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv')
		# deaths_raw = pd.read_csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv')
		# recoveries_raw = pd.read_csv('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv')

		confirmed_raw['Province/State'].fillna('-', inplace=True)
		# deaths_raw['Province/State'].fillna('-', inplace=True)
		# recoveries_raw['Province/State'].fillna('-', inplace=True)

		# recoveries_raw.head()

		self.indexes = ['Province/State', 'Country/Region']
		self.geo_loc = ['Lat', 'Long']
		self.dates = confirmed_raw.columns[4:]
		self.non_dates = [e for e in confirmed_raw.columns if e not in self.dates]

		pred_dates = pd.date_range(self.dates[-1], periods=self.future_dates) + pd.Timedelta(days=1)
		pred_dates = pd.to_datetime(self.dates).strftime('%m/%d/%Y').to_list() + pred_dates.strftime('%m/%d/%Y').tolist()
		self.pred_dates = pred_dates

		def calc_first_date(x):
			first_date_idx = np.where(x.values > 0)[0]
			if(len(first_date_idx) == 0):
				first_date_idx = -1
			else:
				first_date_idx = first_date_idx.item(0)
				
			return x.index[first_date_idx]  

		confirmed_raw['First_Date'] = confirmed_raw[self.dates].apply(lambda x: calc_first_date(x), axis=1)
		confirmed_raw['First_Date'] = pd.to_datetime(confirmed_raw['First_Date'])
		confirmed_raw.set_index('Country/Region', inplace=True)

		non_dates = [e for e in confirmed_raw.columns if e not in self.dates]

		confirmed_raw.loc['Global'] = confirmed_raw[self.dates].sum(axis=0)
		confirmed_raw.loc['Global', 'First_Date'] = confirmed_raw.loc['China', 'First_Date'].min()
		confirmed_raw.fillna('-', inplace=True)

		self.dates_df = confirmed_raw[self.dates]
		confirmed_raw.drop(self.dates, axis=1, inplace=True)
		confirmed_raw = pd.concat([confirmed_raw, self.dates_df], axis=1, sort=False)

		confirmed_df = confirmed_raw.drop(['Province/State', 'Lat', 'Long'], axis=1)

		confirmed_df_temp = confirmed_df[self.dates].groupby('Country/Region').sum()
		confirmed_df_temp['First_Date'] = confirmed_df['First_Date'].groupby('Country/Region').min()
		confirmed_df_temp.loc[['Afghanistan'], self.dates].sum(axis=1)

		confirmed_df = confirmed_df_temp.drop(self.dates, axis=1)
		confirmed_df[self.dates] = confirmed_df_temp[self.dates]
		self.confirmed_df = confirmed_df

	@staticmethod
	def data_prep(confirmed_df, country_name, future_dates, dates):
		x = pd.to_datetime(confirmed_df.loc[country_name, dates].index.values) - confirmed_df.loc[country_name, 'First_Date']
		x = x.days.to_list()
		x = [0 if i < 0 else i for i in x]

		x_pred = np.arange(1, future_dates+1)
		x_pred = x_pred + x[-1]
		x_pred = x + x_pred.tolist()  

		x = np.array(x).reshape(-1,1)
		x_pred = np.array(x_pred).reshape(-1,1)

		y = confirmed_df.loc[country_name, dates].to_list()
		y = np.array(y)
		
		x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)    
		
		return x_train, x_test, x_pred, y_train, y_test

	def update_model(self):
		for index, data in self.confirmed_df.iterrows():
			x_train, x_test, x_pred, y_train, y_test = self.data_prep(self.confirmed_df, index, self.future_dates, self.dates)

			mlp_final = MLPRegressor(hidden_layer_sizes=100, solver='lbfgs', alpha=0.00005, learning_rate_init=0.01, max_iter=300)
			mlp_final.fit(x_train, y_train)

			if(index == 'Taiwan*'): index = 'Taiwan'
			pickle.dump(mlp_final, open('static/model/'+index+'.pkl', 'wb'))

	def get_prediction(self, country_name):
		directory = 'static/model'

		model = pickle.load(open(directory + '/' + country_name + '.pkl', 'rb'))
		if(country_name == 'Taiwan'): country_name = 'Taiwan*'
		x_train, x_test, x_pred, y_train, y_test = self.data_prep(self.confirmed_df, country_name, self.future_dates, self.dates)
		
		y_proj_pred = model.predict(x_pred)
		y_proj_pred = y_proj_pred.astype('int')

		return {'prediction': y_proj_pred.tolist(), 
				'actual': self.confirmed_df.loc[country_name, self.dates].to_list(), 
				'dates': self.pred_dates}