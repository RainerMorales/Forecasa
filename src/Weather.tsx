import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
function Weather() {
  return (
    <>
      <div className="border rounded-2xl border-zinc-500 w-sm h-120 m-auto mt-20 comic-relief-regular">
        <div className="flex flex-col items-center p-6">
          <div className="p-6">
            <img className="w-20" src="cloudy.png" alt="" />
          </div>
          <div className="font-bold text-6xl">30</div>
          <div className="text-2xl font-bold p-4">Philippines</div>
        </div>
        <div className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <WiHumidity size={30} />
            <div>Humidity</div>
            <div>200</div>
          </div>
          <div className="flex flex-col items-center">
            <FaWind size={30} />
            <div>Wind Speed</div>
            <div>200</div>
          </div>
        </div>
        <div className="flex justify-center p-10">
          <label className="input ">
            <svg
              className="h-[1em] opacity-50"
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
            <input type="search" required placeholder="Search" />
          </label>
        </div>
      </div>
    </>
  );
}
export default Weather;
