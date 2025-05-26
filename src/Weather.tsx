import.meta.env.VITE_WEATHER_API_KEY;
import { BsSunrise } from "react-icons/bs";
import { BsSunset } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
function Weather() {
  const dates = new Date().toLocaleDateString();
  type WeatherData = {
    city: string;
    windspeed: number | string;
    temp: number | string;
    sunrise: number | string;
    sunset: number | string;
  };
  const [Temp, setTemp] = useState<WeatherData | null>(null);
  const [aqi, setAQI] = useState("-");
  const inputs = useRef<HTMLInputElement>(null);
  async function api(city: string) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;
      const key = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(`${url}&units=metric&appid=${key}`);
      const result = await response.json();
      const lat = result.coord.lat;
      const lon = result.coord.lon;
      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
      );
      const aqiResult = await aqiRes.json();
      const aqiData = aqiResult.list[0].main.aqi;
      if (aqiData === 1) setAQI("Good");
      else if (aqiData === 2) setAQI("Fair");
      else if (aqiData === 3) setAQI("Moderate");
      else if (aqiData === 4) setAQI("Poor");
      else if (aqiData === 5) setAQI("Very Poor");
      else setAQI("Unknown");

      const sunrise = new Date(result.sys.sunrise * 1000).toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );
      const sunset = new Date(result.sys.sunset * 1000).toLocaleTimeString(
        undefined,
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );
      console.log(sunrise);
      setTemp({
        temp: Math.round(result.main.temp) + "°C",
        city: result.name,
        windspeed: result.wind.speed,
        sunrise: sunrise,
        sunset: sunset,
      });
    } catch (err) {
      toast.error(city + " Not Found!");
      setTemp({
        temp: "-",
        city: "",
        windspeed: "-",
        sunrise: "-",
        sunset: "-",
      });
    }
  }

  useEffect(() => {
    api("philippines");
  }, []);

  return (
    <>
      <Toaster></Toaster>
      <div className=" font-mono absolute inset-0 bg-black/10">
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="flex justify-between w-full font-bold text-sm opacity-80">
            <div>GoodMorning</div>
            <div>{dates}</div>
          </div>

          <div className="p-4">
            <img className="w-20" src="cloudy.png" alt="" />
          </div>
          <div className="font-bold text-6xl">
            {Temp ? (
              <div>{Temp.temp}</div>
            ) : (
              <div>
                <span className="loading loading-spinner loading-xs"></span>
              </div>
            )}
          </div>
          <div className="text-xl">{Temp?.city}</div>
          <div className="text-sm text-center bg-white rounded-full text-zinc-600 w-fit p-2 font-bold ">
            AQI:{aqi}
          </div>
        </div>
        <div className="flex justify-center text-center gap-8">
          <div className="flex flex-col items-center justify-center w-40 h-25 rounded-2xl backdrop-blur-sm bg-white/20 border border-white/20 ">
            <BsSunrise size={30} />
            <div>Sunrise</div>
            <div>{Temp?.sunrise}</div>
          </div>
          <div className="flex flex-col items-center justify-center w-40 h-25 rounded-2xl backdrop-blur-sm bg-white/20 border border-white/20 ">
            <BsSunset size={30} />
            <div>Sunset</div>
            <div>{Temp?.sunset}</div>
          </div>
        </div>
        <div className="flex justify-center p-10">
          <label className="input flex items-center gap-2 bg-white/20 border border-white/20 rounded px-3 py-2 ">
            <svg
              className="h-[1em] opacity-50 "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              className="bg-transparent  placeholder-zinc-600 outline-none w-full"
              ref={inputs}
              type="search"
              required
              placeholder="Country/City"
            />
          </label>
          <button
            onClick={() => inputs.current?.value && api(inputs.current.value)}
            className="btn  bg-zinc-800 hover:bg-zinc-800 text-white border-none shadow-none"
          >
            Search
          </button>
        </div>
      </div>
      <div className="fixed p-8 bottom-0 w-full text-center text-sm opacity-60">
        Powered by OpenWeather
      </div>
    </>
  );
}
export default Weather;
