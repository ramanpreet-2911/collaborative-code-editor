import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import MonacoEditor from "../components/MonacoEditor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import LanguageSelector from "../components/LanguageSelector";
import { language } from "@codemirror/language";

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const languageRef = useRef("javascript");
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //Listening for JOINED event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            toast.success(`${username} has joined the room`);
            console.log(`${username} has joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
          socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
            // Emit language change event
            roomId,
            language: languageRef.current, // Emit the current language
          });
        }
      );

      //listening for Language_change event

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        languageRef.current = language;
      });

      //Listening for DISCONNECTED EVENT
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has left the room.`);
        setClients((previous) => {
          return previous.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Copied Room ID ${roomId} to clipboard!`);
    } catch (error) {
      toast.error(`Could not copy the Room ID`);
      console.log(error);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <MonacoEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
