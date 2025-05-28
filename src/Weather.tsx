import.meta.env.VITE_WEATHER_API_KEY;
import { BsSunrise } from "react-icons/bs";
import { BsSunset } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { BlurFade } from "./components/magicui/blur-fade";
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
import feelslike from "./assets/feelslike.png";
import groundlevel from "./assets/groundlevel.png";
import pressure from "./assets/pressure.png";
import sealevel from "./assets/sealevel.png";

function Weather() {
  // const dates = new Date().toLocaleDateString();

  type WeatherData = {
    city: number|string;
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
  const [loading, setloading] = useState(false);
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
      toast.success(city+" is available", { id: toastId });
      setOpen(false);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(city + " Not Found!", { id: toastId });
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
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    setloading(true);
    api("Manila");
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <span className="loading loading-bars bg-black loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Toaster></Toaster>
      <BlurFade
      direction="up"
       className=" bg-black/10 text-red-950">
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
                  <DialogTitle className="text-center">
                    Check the Weather
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="justify-center">
                      Country/City
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

          <div className="text-sm text-center bg-white/80 rounded-full text-black w-32 p-2 font-bold  ">
            AQI:{aqi}
          </div>
        </div>
        <div className="max-w-xl m-auto grid grid-cols-2 gap-2">
          <div className="rounded-2xl text-white bg-red-950 p-6">
            <div className="flex flex-col items-center">
              <BsSunrise size={30} />
              <div className="text-2xl font-bold">Sunrise</div>
              <div className="text-sm">{weatherData?.sunrise}</div>
            </div>
          </div>
          <div className="rounded-2xl text-white bg-red-950 p-6">
            <div className="flex flex-col items-center">
              <BsSunset size={30} />
              <div className="text-2xl font-bold">Sunset</div>
              <div className="text-sm">{weatherData?.sunset}</div>
            </div>
          </div>

          <div className="col-span-2 p-2 ">
            <div className="flex text-sm p-2 justify-between items-center h-12 rounded-sm text-white  m-2 ">
              <div className="flex items-center font-bold space-x-2 ">
                <div>
                  <img src={feelslike} alt="" className="w-4 filter invert" />
                </div>
                <div>Feels Like</div>
              </div>
              <div>{weatherData?.feelsLike}</div>
            </div>
            <div className="flex text-sm p-2 justify-between items-center h-12 rounded-sm text-white  m-2 ">
              <div className="flex items-center font-bold space-x-2 ">
                <div>
                  <img src={groundlevel} alt="" className="w-4 filter invert" />
                </div>
                <div>Ground Level</div>
              </div>
              <div>{weatherData?.groundLevel}</div>
            </div>
            <div className="flex text-sm p-2 justify-between items-center h-12 rounded-sm text-white  m-2 ">
              <div className="flex items-center font-bold space-x-2 ">
                <div>
                  <img src={pressure} alt="" className="w-4 filter invert" />
                </div>
                <div>Pressure</div>
              </div>
              <div>{weatherData?.pressure}</div>
            </div>
            <div className="flex text-sm p-2 justify-between items-center h-12 rounded-sm text-white  m-2 ">
              <div className="flex items-center font-bold space-x-2 ">
                <div>
                  <img src={sealevel} alt="" className="w-4 filter invert" />
                </div>
                <div>Sea Level</div>
              </div>
              <div>{weatherData?.seaLevel}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-center text-white/50 text-xs h-20 ">
          Developed by Rainer Morales
        </div>
      </BlurFade>
    </>
  );
}
export default Weather;
