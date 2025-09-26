import { useState, useEffect } from "react";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({
    soilMoisture: 45, // dummy for now
    temperature: null,
    humidity: null,
    condition: "",
    recommendation: "No Irrigation",
  });

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("India");

  const API_KEY = "ddce2934c4f79c76915207c99d113f30"; 

  // Function to fetch weather data
  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        const temp = Math.round(data.main.temp);
        const hum = data.main.humidity;
        const condition = data.weather[0].main;

        setSensorData((prev) => ({
          ...prev,
          temperature: temp,
          humidity: hum,
          condition,
          recommendation: prev.soilMoisture < 40 ? "Irrigate" : "No Irrigation",
        }));

        setLocation(data.name);
      } else {
        alert(`City not found: ${city}`);
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Handle Enter key in search bar
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      fetchWeather(search);
      setSearch("");
    }
  };

  // Format current date
  const formatDate = () => {
    const today = new Date();
    return {
      day: today.toLocaleDateString("en-US", { weekday: "long" }),
      date: today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  };

  const { day, date } = formatDate();

  // Fetch default weather once (India) on page load
  useEffect(() => {
    fetchWeather("India");
  }, []);

  const getIrrigationTip = () => {
    if (sensorData.temperature > 35) {
      return "High heat detected 🌡️. Water your crops early morning or late evening to reduce evaporation.";
    } else if (sensorData.temperature >= 25 && sensorData.temperature <= 35) {
      return "Moderate temperature. Regular irrigation is sufficient ✅.";
    } else if (sensorData.temperature < 25) {
      return "Cool conditions 🌱. Irrigation may not be urgently required.";
    } else {
      return "";
    }
  };
    
  return (
    <div className="w-full min-h-screen flex flex-col gap-[35px] bg-[#060C1A] text-white p-8">
      <div className="w-full flex flex-row justify-between">
        {/* Search Bar */}
        <div className="flex flex-row gap-5 justify-center bg-[#0E1421] w-[520px] rounded-[50px] px-[22px] py-[11px] ">
          <img src="/assets/search-icon.png" alt="" className="w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="Search Place...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-[#676B73] text-sm focus:outline-none bg-transparent"
          />
        </div>

        <div className="w-[322px] p-[8px] bg-[#0E1421] rounded-[50px] flex flex-row gap-[10px] items-center">
          <div className="w-[30px] p-[2px] bg-[#742BEC] rounded-[50px]">
            <img src="/assets/user.png" alt="" className="w-full" />
          </div>
          <p className="text-sm text-[#ffffff]">Username</p>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center">
        {/* Left Card */}
        <div className="w-[676px] h-[370px] bg-[#0E1421] rounded-[40px] p-6 flex flex-row justify-between items-center">
          <div className="flex flex-col gap-[34px]">
            <div className="bg-[#742BEC] w-[auto] h-[40px] rounded-[50px] px-[13px] py-[10px] flex flex-row gap-[5px] items-center">
              <img src="/assets/location.png" alt="" />
              <p className="w-full">{location}</p>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[40px] font-medium">{day}</h2>
              <p>{date}</p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="text-5xl font-bold">
                {sensorData.temperature !== null
                  ? `${sensorData.temperature}°C`
                  : "--"}
              </p>
              <p className="text-lg">{sensorData.condition || "Condition"}</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img src="/assets/Cloud.png" alt="" />
          </div>
        </div>

        {/* Right Card - Today Highlight */}
        <div className="w-[530px] h-[439px] px-[18px] py-[16px] rounded-[30px] bg-[#121B2F]">
          <h2 className="text-[20px] mb-4">Today Highlight</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-2 flex flex-col gap-[30px]">
              <h3 className="font-semibold">Soil Moisture</h3>
              <p className="w-full text-center text-6xl">
                {sensorData.soilMoisture}%
              </p>
            </div>
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-2 flex flex-col gap-[30px]">
              <h3 className="font-semibold">Temperature</h3>
              <p className="w-full text-center text-6xl">
                {sensorData.temperature !== null
                  ? `${sensorData.temperature}°C`
                  : "--"}
              </p>
            </div>
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-2 flex flex-col gap-[30px]">
              <h3 className="font-semibold">Humidity</h3>
              <p className="w-full text-center text-6xl">
                {sensorData.humidity !== null
                  ? `${sensorData.humidity}%`
                  : "--"}
              </p>
            </div>
            <div className="bg-[#0E1421] h-[170px] rounded-[22px] p-2 flex flex-col gap-[30px]">
              <h3 className="font-semibold">AI Recommendation</h3>
              <p
                className={`w-full text-center text-3xl ${
                  sensorData.recommendation === "Irrigate"
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {sensorData.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation Suggestion */}
      {sensorData.temperature !== null && (
        <div className="w-full bg-[#0E1421] mt-6 p-4 rounded-[20px] text-center">
          <h3 className="text-lg font-semibold mb-2">Irrigation Tip</h3>
          <p className="text-sm text-gray-300">{getIrrigationTip()}</p>
        </div>
      )}
    </div>
  );
}