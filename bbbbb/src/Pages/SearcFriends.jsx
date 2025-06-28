import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../Forum/api';

const API_BASE = "http://localhost:8082/api/follow";

function SearchFriends() {
  const [followingUsername, setFollowingUsername] = useState(""); // Axtarılan istifadəçi adı
  const [pendingRequests, setPendingRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  // İstifadəçi adı localStorage-dan bir dəfə alınır
  const currentUsername = localStorage.getItem("username");

  // İlk renderdə token və username yoxlanılır
  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Bu səhifəyə daxil olmaq üçün giriş etməlisiniz.");
      navigate("/login");
    }
    if (!currentUsername) {
      alert("İstifadəçi adı tapılmadı, zəhmət olmasa daxil olun.");
      navigate("/login");
    }
  }, [navigate, currentUsername]);

  // İstifadəçi axtarışı (followingUsername dəyişdikdə)
  useEffect(() => {
    const token = getToken();
    if (followingUsername.trim()) {
      fetch(`${API_BASE}/search?query=${followingUsername}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Axtarış icazəsizdir");
          return res.json();
        })
        .then(setSearchResults)
        .catch(err => {
          console.error(err);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  }, [followingUsername]);

  // Takip isteği göndərir (currentUsername localStorage-dan gəlir)
  const sendFollowRequest = (targetUsername) => {
    const token = getToken();
    if (!currentUsername) {
      alert("Qeydiyyatdan keçin.");
      return;
    }
    if (!targetUsername) {
      alert("Takip etmək üçün istifadəçi adı lazımdır.");
      return;
    }
    fetch(`${API_BASE}/request/${targetUsername}/${currentUsername}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.ok ? res.text() : res.text().then(text => { throw new Error(text); }))
      .then(msg => alert("✅ " + msg))
      .catch(err => alert("❌ " + err.message));
  };

  // Gözləyən takip istəklərini gətirir
  const getPendingRequests = () => {
    const token = getToken();
    fetch(`${API_BASE}/pending/${currentUsername}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setPendingRequests)
      .catch(console.error);
  };

  // Takip isteklerini kabul edir
  const acceptFollowRequest = (fromUsername) => {
    const token = getToken();
    fetch(`${API_BASE}/accept/${fromUsername}/${currentUsername}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.text() : res.text().then(text => { throw new Error(text); }))
      .then(msg => {
        alert("🤝 " + msg);
        getPendingRequests();
        getFollowers();
        getFollowing();
      })
      .catch(err => alert("❌ " + err.message));
  };

  // Takibi bırakır
  const unfollowUser = (targetUsername) => {
    const token = getToken();
    fetch(`${API_BASE}/unfollow/${currentUsername}/${targetUsername}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.text() : res.text().then(text => { throw new Error(text); }))
      .then(msg => {
        alert("✂️ " + msg);
        getFollowing();
      })
      .catch(err => alert("❌ " + err.message));
  };

  // Takipçileri getirir
  const getFollowers = () => {
    const token = getToken();
    fetch(`${API_BASE}/followers/${currentUsername}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setFollowers)
      .catch(console.error);
  };

  // Takip edilenləri getirir
  const getFollowing = () => {
    const token = getToken();
    fetch(`${API_BASE}/following/${currentUsername}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setFollowing)
      .catch(console.error);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Follow Sistemi (React)</h1>

      <h2>Takip Et</h2>
      <input
        type="text"
        placeholder="Takip edeceğin kişi"
        value={followingUsername}
        onChange={e => setFollowingUsername(e.target.value)}
      />
      <button onClick={() => sendFollowRequest(followingUsername)}>Follow Gönder</button>

      {searchResults.length > 0 && (
        <ul style={{ background: "#eee", padding: 10, marginTop: 10 }}>
          {searchResults.map(user => (
            <li key={user.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              {user.username}
              <button onClick={() => sendFollowRequest(user.username)}>Takip Et</button>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h2>Gelen İstekler</h2>
      <button onClick={getPendingRequests}>İstekleri Göster</button>
      <ul>
        {pendingRequests.length === 0 ? (
          <li>Bekleyen takip isteği bulunmamaktadır.</li>
        ) : (
          pendingRequests.map(req => (
            <li key={req.id}>
              Kimden: {req.follower.username}
              <button onClick={() => acceptFollowRequest(req.follower.username)}>Kabul Et</button>
            </li>
          ))
        )}
      </ul>

      <hr />
      <h2>Takipçilerim</h2>
      <button onClick={getFollowers}>Takipçileri Getir</button>
      <ul>
        {followers.length === 0 ? (
          <li>Takipçiniz bulunmamaktadır.</li>
        ) : (
          followers.map(user => <li key={user.id}>{user.username}</li>)
        )}
      </ul>

      <hr />
      <h2>Benim Takip Ettiklerim</h2>
      <button onClick={getFollowing}>Takip Ettiklerimi Getir</button>
      <ul>
        {following.length === 0 ? (
          <li>Takip ettiğiniz kimse bulunmamaktadır.</li>
        ) : (
          following.map(user => (
            <li key={user.id}>
              {user.username}
              <button style={{ marginLeft: 10 }} onClick={() => unfollowUser(user.username)}>Takipten Çıkar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SearchFriends;
