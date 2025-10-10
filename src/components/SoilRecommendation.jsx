import { useState, useEffect } from "react";
import cropDatabase from "../cropDatabase.json";

export default function SoilRecommendation() {
  const [mode, setMode] = useState("general");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [soilData, setSoilData] = useState({ N: "", P: "", K: "", pH: "" });
  const [loading, setLoading] = useState(false);
  const [generalRecommendations, setGeneralRecommendations] = useState([]);
  const [specializedRecommendations, setSpecializedRecommendations] = useState([]);
  const [error, setError] = useState("");

  // Get crops based on lat/lon
  const getCropsByLocation = (lat, lon) => {
    const numLat = parseFloat(lat);
    const numLon = parseFloat(lon);

    const zones = cropDatabase.zones.filter(
      (z) =>
        numLat >= z.latRange[0] &&
        numLat <= z.latRange[1] &&
        numLon >= z.lonRange[0] &&
        numLon <= z.lonRange[1]
    );

    return zones.flatMap((z) => z.recommendedCrops);
  };

  // General mode: fetch recommendations based on location
  const fetchCropsByLocation = () => {
    if (!lat || !lon) {
      alert("Please enter both latitude and longitude!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const recommended = getCropsByLocation(lat, lon);
      if (recommended.length === 0) {
        setError("No crop data available for this location.");
      }
      setGeneralRecommendations(recommended);
      localStorage.setItem("generalRecs", JSON.stringify(recommended));
    } catch (err) {
      console.error(err);
      setError("Failed to get crop recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Specialized mode: filter crops based on soil data
  const handleSpecializedSubmit = () => {
    console.log("Specialized submit clicked ✅");
    const allCrops = cropDatabase.zones.flatMap(zone => zone.recommendedCrops) || [];
    console.log("Retrieved crops:", allCrops);

    const ph = parseFloat(soilData.pH) || 6.5;
    const n = parseFloat(soilData.N) || 50;
    const p = parseFloat(soilData.P) || 30;
    const k = parseFloat(soilData.K) || 40;

    const filteredCrops = allCrops.filter((crop) => 
      ph >= crop.idealPH[0] &&
      ph <= crop.idealPH[1] &&
      n >= crop.idealN * 0.8 && n <= crop.idealN * 1.2 &&
      p >= crop.idealP * 0.8 && p <= crop.idealP * 1.2 &&
      k >= crop.idealK * 0.8 && k <= crop.idealK * 1.2
    );

    const finalRecs = filteredCrops.length ? filteredCrops : allCrops.slice(0, 2);

    setSpecializedRecommendations(finalRecs);
    localStorage.setItem("specialRecs", JSON.stringify(finalRecs));
  };

  useEffect(() => {
    const savedGeneral = localStorage.getItem("generalRecs");
    if (savedGeneral) setGeneralRecommendations(JSON.parse(savedGeneral));

    const savedSpecial = localStorage.getItem("specialRecs");
    if (savedSpecial) setSpecializedRecommendations(JSON.parse(savedSpecial));
  }, []);

  return (
    <div className="flex flex-col gap-7 p-6 bg-[#060C1A] text-white w-full min-h-screen overflow-x-hidden">
      <div className="flex flex-col xs:flex-row gap-4">
        <button
          className={`flex flex-row justify-start gap-2 px-4 py-2 rounded focus:outline-none ${
            mode === "general" ? "bg-[#742BEC]" : "bg-[#1C2230]"
          }`}
          onClick={() => setMode("general")}
        >
          <img
            src={mode === "general" ? "assets/global-active.png" : "assets/global-inactive.png"}
            alt="General Mode"
          />
          General Mode
        </button>
        <button
          className={`flex flex-row justify-start gap-2 px-4 py-2 rounded focus:outline-none ${
            mode === "specialized" ? "bg-[#742BEC]" : "bg-[#1C2230]"
          }`}
          onClick={() => setMode("specialized")}
        >
          <img
            src={mode === "specialized" ? "assets/stars-active.png" : "assets/stars-inactive.png"}
            alt="Specialized Mode"
          />
          Specialized Mode
        </button>
      </div>

      {/* General Mode */}
      {mode === "general" && (
        <div className="flex flex-col gap-4">
          <p>Enter location (latitude & longitude):</p>
          <div className="w-full flex flex-col lg:flex-row gap-2">
            <input
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full xs:w-[300px] p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full xs:w-[300px] p-2 rounded bg-[#121B2F] text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={fetchCropsByLocation}
              className="w-full xs:w-[300px] px-4 bg-[#742BEC] rounded text-[#efefef]"
            >
              {loading ? "Fetching..." : "Fetch Crops"}
            </button>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
      )}

      {/* Specialized Mode */}
      {mode === "specialized" && (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 justify-between">
            <input
              type="number"
              placeholder="N (Nitrogen)"
              value={soilData.N}
              onChange={(e) => setSoilData({ ...soilData, N: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] flex-1 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="P (Phosphorus)"
              value={soilData.P}
              onChange={(e) => setSoilData({ ...soilData, P: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] flex-1 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="K (Potassium)"
              value={soilData.K}
              onChange={(e) => setSoilData({ ...soilData, K: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] flex-1 text-white placeholder-gray-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="pH"
              value={soilData.pH}
              onChange={(e) => setSoilData({ ...soilData, pH: e.target.value })}
              className="text-center p-2 rounded bg-[#121B2F] flex-1 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSpecializedSubmit}
              className="px-4 py-2 bg-[#742BEC] rounded w-[200px]">
              Recommendations
            </button>
          </div>
        </div>
      )}

      {/* General Mode Recommendations */}
      {mode === "general" && generalRecommendations.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Recommended Crops (General Mode):
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] xs:grid-cols-[repeat(auto-fit,400px)] gap-4">
            {generalRecommendations.map((crop, index) => (
              <div
                key={index}
                className="p-4 rounded bg-[#121B2F] w-full xs:w-[400px]"
              >
                <h3 className="font-bold text-lg">{crop.name}</h3>
                <p className="text-sm">
                  Soil Type: {crop.soilType} | Climate: {crop.climate} | Water:{" "}
                  {crop.waterRequirement}
                </p>
                <p className="text-sm">
                  Suitable pH: {crop.idealPH[0]} - {crop.idealPH[1]} | N: {crop.idealN} | P:{" "}
                  {crop.idealP} | K: {crop.idealK}
                </p>
                {crop.season && <p className="text-sm">Season: {crop.season}</p>}
                {crop.otherInfo && <p className="text-sm">{crop.otherInfo}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Mode Recommendations */}
      {mode === "specialized" && specializedRecommendations.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Recommended Crops (Specialized Mode):
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] xs:grid-cols-[repeat(auto-fit,400px)] gap-4">
            {specializedRecommendations.map((crop, index) => (
              <div
                key={index}
                className="p-4 rounded bg-[#121B2F] w-full xs:w-[400px]"
              >
                <h3 className="font-bold text-lg">{crop.name}</h3>
                <p className="text-sm">
                  Soil Type: {crop.soilType} | Climate: {crop.climate} | Water:{" "}
                  {crop.waterRequirement}
                </p>
                <p className="text-sm">
                  Suitable pH: {crop.idealPH[0]} - {crop.idealPH[1]} | N: {crop.idealN} | P:{" "}
                  {crop.idealP} | K: {crop.idealK}
                </p>
                {crop.season && <p className="text-sm">Season: {crop.season}</p>}
                {crop.otherInfo && <p className="text-sm">{crop.otherInfo}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}