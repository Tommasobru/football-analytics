import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import GraphView from "./pages/GraphView";
import HeadToHead from "./pages/HeadToHead";
import TeamProfile from "./pages/TeamProfile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-slate-900 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/graph" element={<GraphView />} />
              <Route path="/head-to-head" element={<HeadToHead />} />
              <Route path="/team/:teamId" element={<TeamProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
