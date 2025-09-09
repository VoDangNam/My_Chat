import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Layout() {
  const [friends, setFriends] = useState([]);
  const username = localStorage.getItem("username"); // username đang đăng nhập
  const navigate = useNavigate();
  const location = useLocation(); // lấy thông tin route hiện tại

  useEffect(() => {
    if (!username) return; // đợi có username
    if (location.pathname.startsWith("/chat")) {
      axios
        .get(`http://localhost:8081/friends/${username}`)
        .then((res) => {
          console.log("Friends data:", res.data);
          setFriends(res.data);
        })
        .catch((err) => console.error("Lỗi load friends:", err));
    }
  }, [username, location.pathname]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-800 text-white flex flex-col">
        {/* Logo + Username */}
        <div
          className="p-4 text-lg font-bold cursor-pointer border-b border-gray-700"
          onClick={() => navigate("/chat")}
        >
          My Chat
          {username && (
            <div className="text-sm font-normal text-gray-300 mt-1">
              Xin chào, <span className="font-semibold">{username}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto">
          {/* Link đến trang Chat chung */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Chat chung
          </NavLink>

          {/* Link đến trang Lưu trữ */}
          <NavLink
            to="/luu-tru"
            className={({ isActive }) =>
              `block px-4 py-2 hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Lưu trữ
          </NavLink>

          {/* Danh sách bạn bè */}
          {location.pathname.startsWith("/chat") && (
            <div className="mt-4">
              <div className="px-4 py-2 text-sm font-semibold text-gray-300">
                Bạn bè
              </div>
              {friends.map((f) => (
                <NavLink
                  key={f.id}
                  to={`/chat/${f.username}`}
                  className={({ isActive }) =>
                    `block px-4 py-2 hover:bg-gray-700 ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                >
                  {f.username}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
