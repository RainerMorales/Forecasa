import.meta.env.VITE_WEATHER_API_KEY;
import { BsSunrise } from "react-icons/bs";
import { BsSunset } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Weather() {
  // const dates = new Date().toLocaleDateString();
  type WeatherData = {
    city: string;
    windspeed: number | string;
    temp: number | string;
    temp_max: number | string;
    temp_min: number | string;
    sunrise: number | string;
    sunset: number | string;
    aqi: number | string;
    description: number | string;
    feelsLike: number | string;
    groundLevel: number | string;
    pressure: number | string;
    seaLevel: number | string;
  };
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [open, setOpen] = useState(false);
  const [aqi, setAQI] = useState("-");
  const searchLoc = () => {
    if (city.trim() === "") {
      toast.error("Type City!");
    } else {
      setCity("");
      api(city);
    }
  };
  const api = async (city: string) => {
    const toastId = toast.loading("Please Wait!");
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
      setWeatherData({
        temp: Math.round(result.main.temp) + "°C",
        temp_max: Math.round(result.main.temp_max) + "°C",
        temp_min: Math.round(result.main.temp_min) + "°C",
        city: result.name,
        windspeed: result.wind.speed,
        sunrise: sunrise,
        sunset: sunset,
        aqi: "-",
        description: result.weather[0].description,
        feelsLike: result.main.feels_like + "°C",
        groundLevel: result.main.grnd_level + " hPa",
        pressure: result.main.pressure + " hPa",
        seaLevel: result.main.sea_level + " hPa",
      });
      toast.success(city,{id:toastId})
      setOpen(false);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(city + " Not Found!",{id:toastId});
      setWeatherData({
        temp: "-",
        temp_max: "-",
        temp_min: "-",
        city: "-",
        windspeed: "-",
        sunrise: "-",
        sunset: "-",
        aqi: "-",
        description: "",
        feelsLike: "-",
        groundLevel: "-",
        pressure: "-",
        seaLevel: "-",
      });
      setOpen(true);
    }
  };

  useEffect(() => {
    api("Manila");
  }, []);

  return (
    <>
      <Toaster></Toaster>
      <div className="  absolute inset-0 bg-black/10 text-red-950">
        <div className="flex flex-col items-center p-6 gap-4">
          <div className="flex justify-between items-center w-full font-bold text-sm opacity-80 ">
            <div className="text-xl  flex items-center">
              <TiWeatherPartlySunny />
              Forcasa
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black">
                  <FaSearch />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>Check Weather by City</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      City Name
                    </Label>
                    <Input
                      placeholder="ex: Manila"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={searchLoc} type="submit">
                    Search
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-xl">{weatherData?.city}</div>
          <div className=" flex flex-col items-center">
            <img className="w-20" src="cloudy.png" alt="" />
            <div className="font-bold  text-6xl">{weatherData?.temp}</div>
            <div>{weatherData?.description}</div>
          </div>

          <div className="text-sm text-center bg-white/60 rounded-full text-black w-32 p-2 font-bold  ">
            AQI:{aqi}
          </div>
        </div>
        <div className="max-w-2xl m-auto grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/60 p-6">
            <div className="flex flex-col items-center">
              <BsSunrise size={38} />
              Sunrise
              <div>{weatherData?.sunrise}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/60 p-6">
            <div className="flex flex-col items-center">
              <BsSunset size={38} />
              Sunset
              <div>{weatherData?.sunset}</div>
            </div>
          </div>

          <div className="col-span-2 rounded-2xl bg-white/60 p-6 ">
            <div>
              <div className="flex text-sm p-2 justify-between">
                Feels Like <div>{weatherData?.feelsLike}</div>
              </div>
              <div className="flex text-sm p-2 justify-between">
                Ground Level <div>{weatherData?.groundLevel}</div>
              </div>
              <div className="flex text-sm p-2 justify-between">
                Pressure <div>{weatherData?.pressure}</div>
              </div>
              <div className="flex text-sm p-2 justify-between">
                Sea Level<div>{weatherData?.seaLevel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed p-8 bottom-0 w-full text-center text-sm opacity-60">
        Developed by Rainer Morales
      </div>
    </>
  );
}
export default Weather;
{
  /* AQI:{aqi} */
}
{
  /* <div className="flex justify-center p-10">
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
</div>; */
}
