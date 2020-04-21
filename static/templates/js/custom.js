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
			console.log(data['prediction']);
			console.log(data['actual']);
			console.log(data['dates']);

			dates = data['dates'];
			actual = data['actual'];
			prediction = data['prediction'];

			countryChart.data.labels  = dates.slice(Math.max(dates.length - 30, 0));
			countryChart.data.datasets[0].data  = actual.slice(Math.max(dates.length - 30, 0));
			countryChart.data.datasets[1].data  = prediction.slice(Math.max(dates.length - 30, 0));
			countryChart.update();
		});
	 }

	$("#countryInput").autocomplete({
		source: countries,
		select: function( event, ui ) {
			countryAjax(ui.item.value);
		}
	});

	countryAjax('Global');

	var ticksStyle = {
		fontColor: '#495057',
		fontStyle: 'bold'
	}
	var mode      = 'index'
	var intersect = true
	var $countryChart = $('#countryChart')
	var countryChart  = new Chart($countryChart, {
		data   : {
			labels  : [],
			datasets: [{
			  type                : 'line',
			  data                : [],
			  backgroundColor     : 'transparent',
			  borderColor         : '#007bff',
			  pointBorderColor    : '#007bff',
			  pointBackgroundColor: '#007bff',
			  fill                : false
			  // pointHoverBackgroundColor: '#007bff',
			  // pointHoverBorderColor    : '#007bff'
			},
			  {
			    type                : 'line',
			    data                : [],
			    backgroundColor     : 'tansparent',
			    borderColor         : '#ced4da',
			    pointBorderColor    : '#ced4da',
			    pointBackgroundColor: '#ced4da',
			    fill                : false
			    // pointHoverBackgroundColor: '#ced4da',
			    // pointHoverBorderColor    : '#ced4da'
			  }]
		    },
		    options: {
			maintainAspectRatio: false,
			tooltips           : {
			  mode     : mode,
			  intersect: intersect
			},
			hover              : {
			  mode     : mode,
			  intersect: intersect
			},
			legend             : {
			  display: false
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
			    ticks    : $.extend({
				beginAtZero : true,
				suggestedMax: 200
			    }, ticksStyle)
			  }],
			  xAxes: [{
			    display  : true,
			    gridLines: {
				display: false
			    },
			    ticks    : ticksStyle
			  }]
			}
		}
	});
});