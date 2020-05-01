$(document).ready(function(){
	var countries = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
	 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
	 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
	 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
	 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
	 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi',
	 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
	 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
	 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica',
	 "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark',
	 'Diamond Princess', 'Djibouti', 'Dominica', 'Dominican Republic',
	 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
	 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
	 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Global',
	 'Greece', 'Grenada', 'Guatemala', 'Guinea-Bissau', 'Guinea',
	 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland',
	 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
	 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
	 'Korea, South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
	 'Lebanon', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
	 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
	 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova',
	 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
	 'MS Zaandam', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand',
	 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway',
	 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay',
	 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
	 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
	 'Saint Vincent and the Grenadines', 'San Marino',
	 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
	 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
	 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka',
	 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan*',
	 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
	 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine',
	 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'US',
	 'Uzbekistan', 'Venezuela', 'Vietnam', 'West Bank and Gaza',
	 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

	 function countryAjax(countryName) {
	 	$.get("/predict/" + countryName, function(data, status){
			dates = data['confirmed']['dates'];
			confirmed_actual = data['confirmed']['actual'];
			confirmed_prediction = data['confirmed']['prediction'];
			deaths_actual = data['deaths']['actual'];
			deaths_prediction = data['deaths']['prediction'];
			recovered_actual = data['recovered']['actual'];
			recovered_prediction = data['recovered']['prediction'];

			countryChart.data.labels  = dates.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[0].data  = confirmed_actual.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[1].data  = confirmed_prediction.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[2].data  = deaths_actual.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[3].data  = deaths_prediction.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[4].data  = recovered_actual.slice(Math.max(dates.length - 120, 0));
			countryChart.data.datasets[5].data  = recovered_prediction.slice(Math.max(dates.length - 120, 0));
			countryChart.update();

			$('#cardTitle').text('Number of Cases in ' + countryName);
		});
	 }

	$("#countryInput").autocomplete({
		source: countries,
		select: function( event, ui ) {
			countryAjax(ui.item.value);
		}
	});

	$('#updateModel').click(function() {
		$('#updateModel').prop('disabled', true);
		$('#overlayCard').show();
		$('#mainTitle').text('Updating the model...')

		$.get("/update", function(data, status){
			$('#updateModel').prop('disabled', false);
			$('#overlayCard').hide();
			$('#mainTitle').text('COVID-19 Prediction Dashboard')
		});
	});

	countryAjax('Global');

	var mode      = 'point'
	var intersect = true
	var $countryChart = $('#countryChart')
	var countryChart  = new Chart($countryChart, {
		data   : {
			labels  : [],
			datasets: [{
			  type                : 'line',
			  label              : 'Confirmed',
			  data                : [],
			  backgroundColor     : 'transparent',
			  borderColor         : 'rgba(240, 173, 78, 1)',
			  pointBorderColor    : 'rgba(240, 173, 78, 1)',
			  pointBackgroundColor: 'rgba(240, 173, 78, 1)',
			  fill                : false
			  // pointHoverBackgroundColor: '#007bff',
			  // pointHoverBorderColor    : '#007bff'
			},
			  {
			    type                : 'line',
			    label              : 'Predicted',
			    data                : [],
			    backgroundColor     : 'transparent',
			    borderColor         : 'rgba(240, 173, 78, 0.5)',
			    pointBorderColor    : 'rgba(240, 173, 78, 0.5)',
			    pointBackgroundColor: 'rgba(240, 173, 78, 0.5)',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  },
			  {
			    type                : 'line',
			    label              : 'Deceased',
			    data                : [],
			    backgroundColor     : 'tansparent',
			    borderColor         : 'rgba(217, 83, 79, 1)',
			    pointBorderColor    : 'rgba(217, 83, 79, 1)',
			    pointBackgroundColor: 'rgba(217, 83, 79, 1)',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  },
			  {
			    type                : 'line',
			    label              : 'Predicted',
			    data                : [],
			    backgroundColor     : 'transparent',
			    borderColor         : 'rgba(217, 83, 79, 0.5)',
			    pointBorderColor    : 'rgba(217, 83, 79, 0.5)',
			    pointBackgroundColor: 'rgba(217, 83, 79, 0.5)',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  },
			  {
			    type                : 'line',
			    label              : 'Recovered',
			    data                : [],
			    backgroundColor     : 'tansparent',
			    borderColor         : 'rgba(92, 184, 92, 1)',
			    pointBorderColor    : 'rgba(92, 184, 92, 1)',
			    pointBackgroundColor: 'rgba(92, 184, 92, 1)',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  },
			  {
			    type                : 'line',
			    label              : 'Predicted',
			    data                : [],
			    backgroundColor     : 'transparent',
			    borderColor         : 'rgba(92, 184, 92, 0.5)',
			    pointBorderColor    : 'rgba(92, 184, 92, 0.5)',
			    pointBackgroundColor: 'rgba(92, 184, 92, 0.5)',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  }]
		    },
		    options: {
			maintainAspectRatio: false,
			tooltips           : {
			  mode     : mode,
			  intersect: intersect,
			},
			hover              : {
			  mode     : mode,
			  intersect: intersect
			},
			legend             : {
			  display: true
			},
			scales             : {
			  yAxes: [{
			    // display: false,
			    gridLines: {
				display      : true,
				lineWidth    : '4px',
				color        : 'rgba(0, 0, 0, .2)',
				zeroLineColor: 'transparent'
			    },
			    ticks    : {
			    	fontColor: '#495057',
					fontStyle: 'bold',
					beginAtZero: true,
					callback: function(value, index, values) {
						if(value >= 1e6)
							return value / 1e6 + 'M';
						else if(value >= 1e3)
							return value / 1e3 + 'K';
						else
							return value;
                    }
			    }
			  }],
			  xAxes: [{
			    display  : true,
			    gridLines: {
				display: false
			    },
			    ticks    : {
                    fontColor: '#495057',
					fontStyle: 'bold'
                }
			  }]
			}
		}
	});
});