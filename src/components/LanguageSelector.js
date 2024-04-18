import React, { useState } from "react";
import { LANGUAGE_VERSIONS } from "../constants";
import { useEffect } from "react";
import ACTIONS from "../Actions";
import { useRef } from "react";

const LanguageSelector = ({ language, onSelect, socketRef, roomId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (currLanguage) => {
    setSelectedLanguage(currLanguage);
    setIsOpen(false);
    onSelect(currLanguage);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: currLanguage,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="languageSelectorDiv" ref={dropdownRef}>
      <div style={{ position: "relative" }}>
        {/* Added relative positioning */}
        <button className="btn selectMenuBtn" onClick={toggleMenu}>
          {language}
        </button>
        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "-600%", // Changed top position to align below the button
              left: "0",
              backgroundColor: "#f9f9f9",
              minWidth: "160px",
              boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
              zIndex: "1",
            }}
          >
            {Object.entries(LANGUAGE_VERSIONS).map(
              ([currLanguage, version]) => (
                <button
                  className="menuItems"
                  key={currLanguage}
                  onClick={() => selectLanguage(currLanguage)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    textDecoration: "none",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "blue"; // Change color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "black"; // Restore color on leave
                  }}
                >
                  {currLanguage} - {version}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
