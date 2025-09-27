import React, { useEffect, useState } from "react";
import axios from "axios";

function FriendRequests() {
  const [requests, setRequests] = useState([]);

  // Lấy username từ localStorage
  const getUsername = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?.username;
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const username = getUsername();
      if (!username) return;
      const res = await axios.get(`http://localhost:8081/friends/requests/${username}`);
      console.log("Requests:", res.data); // kiểm tra dữ liệu
      setRequests(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy requests:", error);
    }
  };

 const acceptRequest = async (id) => {
  try {
    await axios.post(`http://localhost:8081/friends/acceptRequest?requestId=${id}`);
    setRequests(requests.filter((req) => req.id !== id));

    // gọi lại API danh sách bạn bè
    const username = getUsername();
    const friendsRes = await axios.get(`http://localhost:8081/friends/${username}`);
    localStorage.setItem("friends", JSON.stringify(friendsRes.data)); // nếu cần lưu
  } catch (error) {
    console.error("Lỗi khi chấp nhận:", error);
  }
};


  const declineRequest = async (id) => {
    try {
      await axios.post(`http://localhost:8081/friends/declineRequest?requestId=${id}`);
      setRequests(requests.filter((req) => req.id !== id)); // remove declined request
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
    }
  };

  return (
    <div>
      <h2>Lời mời kết bạn</h2>
      <ul>
        {requests.map((req) => (
          <li key={req.id} style={{ marginBottom: "10px" }}>
            {req.username}
            <button onClick={() => acceptRequest(req.id)}>Chấp nhận</button>
            <button onClick={() => declineRequest(req.id)}>Từ chối</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendRequests;
