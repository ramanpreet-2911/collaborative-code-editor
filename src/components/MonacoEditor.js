import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import ACTIONS from "../Actions";
import Output from "./Output";

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
    <div className="mainEditorWrap">
      <div id="editor">
        <Editor
          height="89.5vh"
          width="45vw"
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
      <Output editorRef={editorRef} language={language} />
      {/* <div className="run_div">
        <div className="runner_div">
          <div className="innerText">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab,
            doloremque qui, accusamus obcaecati optio dolores consectetur facere
            omnis vitae ipsum magni corrupti quidem? Distinctio a totam animi
            eligendi enim delectus deleniti porro! Unde distinctio, qui a
            obcaecati consequuntur iste totam similique. Harum iusto, maiores,
            ipsum molestiae dolorum debitis iste nihil et sunt deserunt
            consequatur illum deleniti placeat pariatur doloremque. Voluptatibus
            deleniti aspernatur quos nam veritatis iste consectetur repellendus
            dolore amet, sapiente eos maxime ducimus recusandae dolor nisi,
            minus iusto at quo mollitia? Rerum dicta consequatur, magnam fugit
            temporibus amet deserunt consequuntur sed, quam doloremque eum omnis
            nobis quia, quod vitae!
          </div>
        </div>
        <button className="btn runCodeBtn">Run Code</button>
      </div> */}
    </div>
  );
};

//   return (
//     <div id="editor">
//       <Editor
//         height="90vh"
//         language={language}
//         defaultValue="// Some comment"
//         theme="vs-dark"
//         value={value}
//         onChange={handleEditorChange}
//         onMount={onMount}
//       />
//       <LanguageSelector
//         className="languageSelectorDiv"
//         language={language}
//         onSelect={onSelect}
//         socketRef={socketRef}
//         roomId={roomId}
//       />
//     </div>
//   );
// };

export default MonacoEditor;
