import React, { useEffect, useRef } from "react";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorState, Transaction } from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import { boysAndGirls, coolGlow } from "thememirror";

const Editornew = () => {
  const editorWrapperRef = useRef(null);
  const editorViewRef = useRef(null); // Ref to hold the EditorView instance

  useEffect(() => {
    const editorWrapper = editorWrapperRef.current;

    if (!editorWrapper) return;

    const editorElement = document.createElement("div");
    editorWrapper.appendChild(editorElement);

    async function init() {
      const initialText = `console.log("Hello World")`;

      const view = new EditorView({
        parent: editorElement,
        state: EditorState.create({
          doc: initialText,
          extensions: [
            coolGlow,
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            keymap.of([
              ...closeBracketsKeymap,
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...foldKeymap,
              ...completionKeymap,
              ...lintKeymap,
            ]),
            javascript(),
          ],
        }),
      });

      // Store the EditorView instance in the ref
      editorViewRef.current = view;

      // Add update listener to listen for state changes
      const updateListener = EditorView.updateListener.of((v) => {
        console.log("Changes:", v.state.doc.toString());
      });

      // Add the update listener to the EditorView
      view.dispatch({
        effects: [updateListener],
      });
    }

    init();

    return () => {
      // Clean up when component unmounts
      editorElement.remove();
    };
  }, []);

  return <div id="editor" ref={editorWrapperRef} />;
};

export default Editornew;
