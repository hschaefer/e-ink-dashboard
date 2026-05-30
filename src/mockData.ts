import { DashboardData } from './types';

export const mockWeatherData: Record<string, DashboardData> = {
  springShowers: {
    weather: {
      currentTemp: 14.2,
      feelsLike: 13.5,
      condition: "rainy",
      humidity: 84,
      barometricPressure: 1009,
      windSpeed: 21,
      windDirection: "SW",
      indoorTemp: 21.8,
      indoorHumidity: 45,
      lastUpdated: "15:09 UTC"
    },
    hourly: [
      { time: "16:00", temp: 14.1, rainProbability: 90 },
      { time: "17:00", temp: 13.8, rainProbability: 80 },
      { time: "18:00", temp: 13.5, rainProbability: 40 },
      { time: "19:00", temp: 13.2, rainProbability: 20 },
      { time: "20:00", temp: 12.6, rainProbability: 10 },
      { time: "21:00", temp: 11.9, rainProbability: 0 },
      { time: "22:00", temp: 11.2, rainProbability: 0 },
      { time: "23:00", temp: 10.5, rainProbability: 0 },
    ],
    daily: [
      { day: "Thu", tempMin: 9, tempMax: 16, condition: "cloudy", rainProbability: 20 },
      { day: "Fri", tempMin: 8, tempMax: 15, condition: "rainy", rainProbability: 75 },
      { day: "Sat", tempMin: 10, tempMax: 17, condition: "sunny", rainProbability: 10 },
      { day: "Sun", tempMin: 11, tempMax: 19, condition: "sunny", rainProbability: 5 },
      { day: "Mon", tempMin: 10, tempMax: 16, condition: "stormy", rainProbability: 85 },
    ],
    status: {
      wifiSignal: "good",
      batteryPercent: 92,
      haConnected: true
    },
    airQuality: {
      lqiValue: 2,
      lqiLabel: "Good",
      pm25Value: 9,
      pm25Label: "Excellent"
    },
    pollen: [
      { name: "Birch", category: "Tree", level: 4, status: "High", desc: "Highly active; peaks mid-day" },
      { name: "Alder", category: "Tree", level: 5, status: "Very High", desc: "Extreme allergen levels detected" },
      { name: "Oak", category: "Tree", level: 2, status: "Low", desc: "Moderate release from mature trees" },
      { name: "Meadow Grass", category: "Grass", level: 1, status: "Low", desc: "Early season grass starting" },
      { name: "Mugwort", category: "Weed", level: 0, status: "None", desc: "No activity" }
    ]
  },
  mistyMorning: {
    weather: {
      currentTemp: 8.5,
      feelsLike: 7.2,
      condition: "cloudy",
      humidity: 95,
      barometricPressure: 1024,
      windSpeed: 5,
      windDirection: "N",
      indoorTemp: 20.1,
      indoorHumidity: 49,
      lastUpdated: "08:15 UTC"
    },
    hourly: [
      { time: "09:00", temp: 9.2, rainProbability: 10 },
      { time: "10:00", temp: 11.0, rainProbability: 5 },
      { time: "11:00", temp: 12.8, rainProbability: 0 },
      { time: "12:00", temp: 14.5, rainProbability: 0 },
      { time: "13:00", temp: 15.2, rainProbability: 0 },
      { time: "14:00", temp: 15.8, rainProbability: 0 },
      { time: "15:00", temp: 15.5, rainProbability: 10 },
      { time: "16:00", temp: 14.8, rainProbability: 15 },
    ],
    daily: [
      { day: "Thu", tempMin: 7, tempMax: 16, condition: "cloudy", rainProbability: 15 },
      { day: "Fri", tempMin: 9, tempMax: 18, condition: "sunny", rainProbability: 0 },
      { day: "Sat", tempMin: 11, tempMax: 20, condition: "sunny", rainProbability: 10 },
      { day: "Sun", tempMin: 9, tempMax: 15, condition: "rainy", rainProbability: 60 },
      { day: "Mon", tempMin: 8, tempMax: 14, condition: "windy", rainProbability: 25 },
    ],
    status: {
      wifiSignal: "excellent",
      batteryPercent: 88,
      haConnected: true
    },
    airQuality: {
      lqiValue: 1,
      lqiLabel: "Excellent",
      pm25Value: 4,
      pm25Label: "Excellent"
    },
    pollen: [
      { name: "Birch", category: "Tree", level: 1, status: "Low", desc: "Significantly suppressed by morning fog" },
      { name: "Alder", category: "Tree", level: 2, status: "Low", desc: "Slight airborne presence" },
      { name: "Oak", category: "Tree", level: 1, status: "Low", desc: "Cleared from atmosphere by high dampness" },
      { name: "Meadow Grass", category: "Grass", level: 0, status: "None", desc: "Dormant activity" },
      { name: "Mugwort", category: "Weed", level: 0, status: "None", desc: "No active weeds germinating" }
    ]
  },
  goldenAfternoon: {
    weather: {
      currentTemp: 22.4,
      feelsLike: 22.1,
      condition: "sunny",
      humidity: 38,
      barometricPressure: 1018,
      windSpeed: 12,
      windDirection: "ESE",
      indoorTemp: 22.9,
      indoorHumidity: 42,
      lastUpdated: "14:20 UTC"
    },
    hourly: [
      { time: "15:00", temp: 22.8, rainProbability: 0 },
      { time: "16:00", temp: 23.0, rainProbability: 0 },
      { time: "17:00", temp: 22.5, rainProbability: 0 },
      { time: "18:00", temp: 21.2, rainProbability: 0 },
      { time: "19:00", temp: 19.5, rainProbability: 0 },
      { time: "20:00", temp: 17.8, rainProbability: 0 },
      { time: "21:00", temp: 16.0, rainProbability: 0 },
      { time: "22:00", temp: 14.5, rainProbability: 0 },
    ],
    daily: [
      { day: "Thu", tempMin: 12, tempMax: 24, condition: "sunny", rainProbability: 0 },
      { day: "Fri", tempMin: 13, tempMax: 25, condition: "sunny", rainProbability: 0 },
      { day: "Sat", tempMin: 14, tempMax: 26, condition: "sunny", rainProbability: 5 },
      { day: "Sun", tempMin: 12, tempMax: 21, condition: "cloudy", rainProbability: 15 },
      { day: "Mon", tempMin: 11, tempMax: 18, condition: "rainy", rainProbability: 40 },
    ],
    status: {
      wifiSignal: "excellent",
      batteryPercent: 99,
      haConnected: true
    },
    airQuality: {
      lqiValue: 4,
      lqiLabel: "Moderate",
      pm25Value: 24,
      pm25Label: "Moderate"
    },
    pollen: [
      { name: "Meadow Grass", category: "Grass", level: 5, status: "Very High", desc: "Peak summer grass season" },
      { name: "Bermuda Grass", category: "Grass", level: 4, status: "High", desc: "High pollen dispersion in dry warmth" },
      { name: "Mugwort", category: "Weed", level: 3, status: "Moderate", desc: "Moderate weeds pollen active" },
      { name: "Ragweed", category: "Weed", level: 2, status: "Low", desc: "Late summer weed starting" },
      { name: "Birch", category: "Tree", level: 0, status: "None", desc: "Tree pollination fully concluded" }
    ]
  }
};
