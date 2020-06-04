import axios from 'axios';
import { WEATHER_KEY } from './WeatherKey';


const WeatherDataServer = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather'
});


WeatherDataServer.interceptors.request.use(
  async (config) => {
    config.headers.Accept = 'application/json';
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  }, (err) => {
    return Promise.reject(err);
  }
)

export const getWeather = async (lat, long, callback) => {
  const response = await WeatherDataServer.get(`?appid=${WEATHER_KEY}&lat=${lat}&lon=${long}&units=imperial`);
  callback(response.data);
};

export default WeatherDataServer;