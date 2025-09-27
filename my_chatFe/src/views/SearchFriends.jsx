import React, { useState } from "react";
import axios from "axios";

function SearchFriends() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  // 🔎 Tìm kiếm user
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/friends/search?keyword=${keyword}`
      );
      setResults(res.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  // ➕ Gửi lời mời kết bạn
  const sendRequest = async (toUser) => {
    try {
      // ✅ Lấy username từ localStorage (đúng key bạn đã set ở Login)
     const storedUser = JSON.parse(localStorage.getItem("user"));
const fromUser = storedUser?.username;


      if (!fromUser) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      await axios.post(
        `http://localhost:8081/friends/sendRequest?fromUser=${fromUser}&toUser=${toUser}`
      );
      alert(`✅ Đã gửi lời mời kết bạn đến ${toUser}`);
    } catch (error) {
      console.error("Lỗi khi gửi lời mời:", error);
      alert("❌ Gửi lời mời thất bại!");
    }
  };

  return (
    <div>
      <h2>Tìm kiếm bạn bè</h2>
      <input
        type="text"
        placeholder="Nhập username hoặc email"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => sendRequest(user.username)}>Kết bạn</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchFriends;
