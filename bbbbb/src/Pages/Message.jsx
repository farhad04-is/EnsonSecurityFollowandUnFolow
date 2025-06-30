import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WEBSOCKET_URL = "http://localhost:8082/chat";

const Message = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserInput, setNewUserInput] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messageMap, setMessageMap] = useState({});

  const stompClient = useRef(null);
  const scrollBottomRef = useRef(null);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageMap, selectedUser]);

  useEffect(() => {
    if (!token || !username) {
      alert("Zəhmət olmasa, daxil olun.");
      return;
    }

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${WEBSOCKET_URL}?Authorization=Bearer ${token}`),
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket bağlantısı quruldu.");

        client.subscribe("/user/queue/messages", (msg) => {
          const received = JSON.parse(msg.body);
          const from = received.sender;

          setMessageMap((prev) => ({
            ...prev,
            [from]: [...(prev[from] || []), received],
          }));

          setUserList((prevList) => {
            if (!prevList.includes(from) && from !== username) {
              return [...prevList, from];
            }
            return prevList;
          });
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Xətası:", frame.headers["message"]);
      },
      onWebSocketError: (evt) => {
        console.error("❌ WebSocket problemi:", evt);
      },
    });

    stompClient.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [token, username]);

  const addNewUser = () => {
    const newUser = newUserInput.trim();
    if (!newUser) {
      alert("İstifadəçi adı boş ola bilməz");
      return;
    }
    if (userList.includes(newUser) || newUser === username) {
      alert("Bu istifadəçi siyahıda var və ya özünüz ola bilməzsiniz");
      return;
    }

    setUserList((prev) => [...prev, newUser]);
    setSelectedUser(newUser);
    setNewUserInput("");
  };

  const sendMessage = () => {
    if (!selectedUser || !inputMessage.trim()) {
      alert("Alıcı və ya mesaj boş ola bilməz.");
      return;
    }

    const msg = {
      sender: username,
      receiver: selectedUser,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: "/app/private-send",
        body: JSON.stringify(msg),
      });

      setMessageMap((prev) => ({
        ...prev,
        [selectedUser]: [...(prev[selectedUser] || []), msg],
      }));

      setInputMessage("");
    } else {
      alert("WebSocket bağlantısı yoxdur.");
    }
  };

  // Stil obyektləri
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f0f2f5",
      color: "#20232a",
    },
    userListContainer: {
      width: "260px",
      borderRight: "1px solid #ddd",
      padding: "20px",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    },
    usersTitle: {
      marginBottom: "16px",
      fontWeight: "600",
      fontSize: "1.2rem",
      color: "#333",
    },
    userItem: (isSelected) => ({
      padding: "12px 15px",
      marginBottom: "8px",
      cursor: "pointer",
      borderRadius: "8px",
      backgroundColor: isSelected ? "#4a90e2" : "#f7f9fc",
      color: isSelected ? "#fff" : "#555",
      boxShadow: isSelected ? "0 2px 10px rgba(74,144,226,0.4)" : "none",
      transition: "background-color 0.25s ease, color 0.25s ease",
      userSelect: "none",
      fontWeight: "500",
      fontSize: "1rem",
      textAlign: "center",
    }),
    addUserContainer: {
      marginTop: "20px",
    },
    addUserInput: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      marginBottom: "8px",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    addUserButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#4a90e2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    addUserButtonHover: {
      backgroundColor: "#357ABD",
    },
    chatContainer: {
      flex: 1,
      padding: "30px 40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    chatHeader: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "24px",
      color: "#333",
      borderBottom: "1px solid #ddd",
      paddingBottom: "12px",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto",
      paddingRight: "10px",
      backgroundColor: "#e9ebf0",
      borderRadius: "10px",
      padding: "15px",
      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
      maxHeight: "70vh",
      marginBottom: "20px",
    },
    messageBubble: (isSender) => ({
      maxWidth: "70%",
      marginBottom: "14px",
      padding: "10px 16px",
      borderRadius: "18px",
      backgroundColor: isSender ? "#4a90e2" : "#fff",
      color: isSender ? "#fff" : "#444",
      alignSelf: isSender ? "flex-end" : "flex-start",
      boxShadow: isSender
        ? "0 2px 12px rgba(74,144,226,0.7)"
        : "0 1px 8px rgba(0,0,0,0.1)",
      fontSize: "1rem",
      lineHeight: "1.3",
      wordBreak: "break-word",
    }),
    messageInfo: {
      fontSize: "0.75rem",
      color: "#777",
      marginTop: "3px",
      fontStyle: "italic",
    },
    inputContainer: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    messageInput: {
      flexGrow: 1,
      padding: "12px 15px",
      borderRadius: "30px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      outline: "none",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: "border-color 0.2s ease",
    },
    sendButton: {
      padding: "12px 22px",
      borderRadius: "30px",
      backgroundColor: "#4a90e2",
      border: "none",
      color: "#fff",
      fontWeight: "700",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    sendButtonDisabled: {
      backgroundColor: "#a0b9e8",
      cursor: "default",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sol istifadəçi menyusu */}
      <div style={styles.userListContainer}>
        <div>
          <h4 style={styles.usersTitle}>İstifadəçilər</h4>
          {userList.length === 0 && (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              İstifadəçi yoxdur. Aşağıda əlavə edin.
            </p>
          )}
          {userList.map((u) => (
            <div
              key={u}
              onClick={() => setSelectedUser(u)}
              style={styles.userItem(selectedUser === u)}
              title={`Mesajlaşmaq üçün ${u}-yə klikləyin`}
            >
              {u}
            </div>
          ))}
        </div>

        {/* Yeni istifadəçi əlavə etmək üçün input */}
        <div style={styles.addUserContainer}>
          <input
            type="text"
            placeholder="Yeni istifadəçi adı əlavə et"
            value={newUserInput}
            onChange={(e) => setNewUserInput(e.target.value)}
            style={styles.addUserInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") addNewUser();
            }}
          />
          <button
            onClick={addNewUser}
            style={styles.addUserButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#357ABD")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4a90e2")
            }
          >
            Əlavə et
          </button>
        </div>
      </div>

      {/* Sağ mesajlaşma paneli */}
      <div style={styles.chatContainer}>
        <h3 style={styles.chatHeader}>
          {selectedUser
            ? `✉ ${selectedUser} ilə yazışma`
            : "İstifadəçi seçin və ya əlavə edin"}
        </h3>

        <div style={styles.messagesContainer}>
          {(messageMap[selectedUser] || []).map((msg, index) => (
            <div
              key={msg.timestamp + index}
              style={styles.messageBubble(msg.sender === username)}
              title={`${msg.sender} — ${new Date(msg.timestamp).toLocaleString()}`}
            >
              <div>{msg.message}</div>
              <div style={styles.messageInfo}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
          <div ref={scrollBottomRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={styles.messageInput}
            disabled={!selectedUser}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              ...styles.sendButton,
              ...(selectedUser && inputMessage.trim()
                ? {}
                : styles.sendButtonDisabled),
            }}
            disabled={!selectedUser || !inputMessage.trim()}
            title={
              !selectedUser
                ? "İstifadəçi seçin"
                : !inputMessage.trim()
                ? "Mesaj boş ola bilməz"
                : "Mesaj göndər"
            }
          >
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
