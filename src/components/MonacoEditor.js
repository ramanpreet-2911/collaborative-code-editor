import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import ACTIONS from "../Actions";
import { editor } from "monaco-editor";

const MonacoEditor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef();
  const languageRef = useRef("javascript");

  const [value, setValue] = useState(`
  // JavaScript
  console.log("Hello, welcome to JavaScript!");
`);
  const [language, setlanguage] = useState("javascript");

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    // socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
    //   setlanguage(language);
    // });
    // socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
    //   console.log("recieving code change:", code);
    //   if (code !== null) {
    //     setValue(code);
    //   }
    // });
    //moved to socketref useffect. checking if that works, working usse pehel
  };

  function handleEditorChange(value, event) {
    // console.log("here is the current model value:", value);
    setValue(value);
    onCodeChange(value);
    // console.log(event);

    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
  }

  const onSelect = (language) => {
    setlanguage(language);
    setValue(CODE_SNIPPETS[language]);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: CODE_SNIPPETS[language],
    });
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: language,
    });
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        setlanguage(language);
        languageRef.current = language;
      });
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("recieving code change:", code);
        if (code !== null) {
          setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
    };
  });

  return (
    <div id="editor">
      <Editor
        height="90vh"
        language={language}
        defaultValue="// Some comment"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        onMount={onMount}
      />
      <LanguageSelector
        className="languageSelectorDiv"
        language={language}
        onSelect={onSelect}
        socketRef={socketRef}
        roomId={roomId}
      />
    </div>
  );
};

export default MonacoEditor;
