import React, { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";

const Editor = () => {
  useEffect(() => {
    async function init() {
      Codemirror.fromTextArea(document.getElementById("realTimeEditor"));
    }
    init();
  }, []);

  return <textarea id="realTimeEditor">Raman</textarea>;
};

export default Editor;
