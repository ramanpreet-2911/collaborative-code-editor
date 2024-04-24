import React from "react";
import { executeCode } from "../api";
import { useState } from "react";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output);
    } catch (error) {}
  };

  return (
    <div className="run_div">
      <div className="runner_div">
        <div className="innerText">
          {output ? output : `Click "Run Code" to see the output here`}
        </div>
      </div>
      <button className="btn runCodeBtn" onClick={runCode}>
        Run Code
      </button>
    </div>
  );
};

export default Output;
