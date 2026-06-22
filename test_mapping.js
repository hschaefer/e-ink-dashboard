import fs from 'fs';

const mapCondition = (haCondition) => {
  const mapping = {
    'clear-night': 'sunny',
    'cloudy': 'cloudy',
    'exceptional': 'stormy',
    'fog': 'cloudy',
    'hail': 'stormy',
    'lightning': 'stormy',
    'lightning-rainy': 'stormy',
    'partlycloudy': 'cloudy',
    'pouring': 'rainy',
    'rainy': 'rainy',
    'snowy': 'snowy',
    'snowy-rainy': 'snowy',
    'sunny': 'sunny',
    'windy': 'windy',
    'windy-variant': 'windy'
  };
  return mapping[haCondition] || haCondition || 'cloudy';
};

const run = async () => {
  const dailyForecast = {"changed_states":[],"service_response":{"weather.goettingen":{"forecast":[{"datetime":"2026-06-22T00:00:00Z","cloud_coverage":88,"condition":"partlycloudy","precipitation_probability":null,"pressure":1024,"uv_index":6,"wind_gust_speed":24.1,"wind_bearing":17.5,"evaporation":null,"fog_probability":0,"sun_irradiance":1140,"visibility":36500,"sun_duration":3900,"precipitation_duration":0,"temperature":27,"templow":22,"dew_point":19,"wind_speed":11.1,"precipitation":0,"humidity":78},{"datetime":"2026-06-23T00:00:00Z","cloud_coverage":55,"condition":"sunny","precipitation_probability":10,"pressure":1020,"uv_index":7,"wind_gust_speed":20.1,"wind_bearing":18.5,"evaporation":null,"fog_probability":0,"sun_irradiance":1140,"visibility":36500,"sun_duration":3900,"precipitation_duration":0,"temperature":28,"templow":23,"dew_point":20,"wind_speed":12.1,"precipitation":0,"humidity":75}]}}};

  const forecastData = Object.values(dailyForecast.service_response)[0];
  if (forecastData && Array.isArray(forecastData.forecast)) {
    const daily = forecastData.forecast.slice(0, 5).map((f) => {
      const date = new Date(f.datetime);
      return {
        day: date.toLocaleDateString([], { weekday: 'short' }),
        tempMin: Math.round(f.templow !== undefined ? f.templow : f.temperature),
        tempMax: Math.round(f.temperature),
        condition: mapCondition(f.condition),
        rainProbability: f.precipitation_probability || 0
      };
    });
    console.log("Mapped Daily:", daily);
  }
};
run();
