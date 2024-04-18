import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    console.log(id);
    toast.success(`New Room Generated with id ${id}`);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id & Username is required!");
      return;
    }
    //redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="/code-sync.png"
          alt="code sync logo"
        ></img>
        <h4 className="mainLabel"> Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="Room ID"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            JOIN
          </button>
          <span className="createInfo">
            {" "}
            If you don't have an invite, then create a &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built by &nbsp;
          <a href="https://www.linkedin.com/in/ramanpreet-29-singh/">
            Ramanpreet Singh
          </a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
