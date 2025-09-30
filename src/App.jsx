import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import SoilRecommendation from "./components/SoilRecommendation";

function App() {
  return (
    <Router basename="/smart-irrigation-dashboard">
      <div className="w-screen min-h-screen">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="soil" element={<SoilRecommendation />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
