import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { WordContext } from "./Context/WordProvider";
import { SignupForm } from "./Forum/SignupForm";
import Button from 'react-bootstrap/Button';
import { Table } from "react-bootstrap";

function HandleTranslate() {
  const { word } = useContext(WordContext);
  const [translation, setTranslation] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [history, setHistory] = useState([]);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTranslation, setEditedTranslation] = useState("");
  const [user, setUser] = useState(null); // AuthContext yerine doğrudan state

  useEffect(() => {
    // Giriş yapmış kullanıcıyı localStorage'dan al
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  useEffect(() => {
    const handleTranslate = async () => {
      if (!word || !word.trim()) return;

      const cleanWord = word.replace(/[.,!?;:"()]/g, "").trim();
      if (!cleanWord) return;

      try {
        const response = await axios.post("http://localhost:8082/api/translate", {
          word: cleanWord,
        });

        const content = response.data;
        let translated = "";
        let level = "";

        if (content.includes("English level:")) {
          const parts = content.split("English level:");
          translated = parts[0].trim();
          const levelMatch = parts[1].match(/[ABCE]\d(?:-\d)?/);
          level = levelMatch ? levelMatch[0].trim() : "";
        } else {
          translated = content;
        }

        const newEntry = {
          id: Date.now(),
          word: cleanWord,
          translation: translated,
          englishLevel: level,
        };
        setHistory((prev) => [...prev, newEntry]);
        setTranslation(translated);
        setEnglishLevel(level);
      } catch (error) {
        console.error("Xəta:", error);
        setTranslation("");
        setEnglishLevel("Xəta baş verdi.");
      }
    };

    handleTranslate();
  }, [word]);

  const handleDelete = (idToDelete) => {
    setHistory((prev) => prev.filter((item) => item.id !== idToDelete));
  };

  const handleEditClick = (id, currentTranslation) => {
    setEditingIndex(id);
    setEditedTranslation(currentTranslation);
  };

  const handleSaveEdit = (idToUpdate) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === idToUpdate ? { ...item, translation: editedTranslation } : item
      )
    );
    setEditingIndex(null);
    setEditedTranslation("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedTranslation("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleSaveHistory = async () => {
    if (!user) {
      alert("Sözləri qeyd etmək üçün əvvəlcə giriş etməlisiniz və ya qeydiyyatdan keçməlisiniz.");
      setShowSignupForm(true);
      return;
    }

    try {
      if (history.length === 0) {
        alert("Saxlanılacaq söz yoxdur.");
        return;
      }

      await axios.post(`http://localhost:8082/wordlists/user/${user.gmail}`, history, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Sözlər uğurla qeyd edildi");
    } catch (error) {
      console.error("Tarix göndərilərkən xəta baş verdi:", error);
      alert("Xəta baş verdi. Yenidən cəhd edin.");
    }
  };

  if (showSignupForm && !user) {
    return (
      <div className="p-6 font-sans max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Qeydiyyatdan Keçin və ya Giriş Edin</h2>
        <SignupForm
          onSignupSuccess={() => {
            const savedUser = JSON.parse(localStorage.getItem("user"));
            if (savedUser) setUser(savedUser);
            setShowSignupForm(false);
          }}
        />
        <button
          onClick={() => setShowSignupForm(false)}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow transition"
        >
          Ləğv Et
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      {(translation || englishLevel) && (
        <div className="bg-white shadow-md rounded p-4 mb-6 border">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Son Nəticə:</h2>
          <p className="text-gray-700 mb-1">{translation}</p>
          <p className="text-sm text-gray-500">English level: {englishLevel}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white shadow-md rounded border p-4">
          <div className="overflow-x-auto border rounded">
            <div className="max-h-96 overflow-y-auto">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Söz</th>
                    <th>Tərcümə</th>
                    <th>Səviyyə</th>
                    <th>Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.word}</td>
                      <td>
                        {editingIndex === item.id ? (
                          <input
                            type="text"
                            value={editedTranslation}
                            onChange={(e) => setEditedTranslation(e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                        ) : (
                          item.translation
                        )}
                      </td>
                      <td>{item.englishLevel}</td>
                      <td>
                        {editingIndex === item.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-green-600"
                            >
                              Yadda Saxla
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                            >
                              Ləğv Et
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(item.id, item.translation)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-blue-600"
                            >
                              Redaktə Et
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Sil
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={clearHistory} variant="danger">
              Cedveli sil
            </Button>
            <button
              onClick={handleSaveHistory}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow transition"
            >
              Yadda Saxla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HandleTranslate;
