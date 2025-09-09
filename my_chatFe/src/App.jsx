import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import HomeAdmin from "./HomeAdmin";
import Layout from "./components/Layout";
import ChatView from "./views/ChatView";
import ArchiveView from "./views/ArchiveView";

function App() {
  const role = localStorage.getItem("role");
  console.log("role: ", role);

  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<Login />} />

        {/* Route cho Admin */}
        <Route
          path="/homeAdmin"
          element={
            role === "ADMIN" ? <HomeAdmin /> : <Navigate to="/login" replace />
          }
        />

        {/* Route cho User (Layout) */}
        <Route
          element={
            role === "USER" ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/chat" element={<ChatView />} />
          <Route path="/chat/:friendUsername" element={<ChatView />} />
          <Route path="/luu-tru" element={<ArchiveView />} />
        </Route>

        {/* Trang mặc định (login) */}
        <Route index element={<Login />} />

        {/* 404 Not found */}
        <Route
          path="*"
          element={
            <div className="h-[60vh] flex items-center justify-center text-red-500">
              Không tìm thấy trang
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
