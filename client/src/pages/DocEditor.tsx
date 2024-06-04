import React, { useRef, useEffect, useState } from 'react';
import {DocumentEditorContainerComponent, Inject, Toolbar} from '@syncfusion/ej2-react-documenteditor';
import WebViewer, { Core } from '@pdftron/webviewer';

import PizZip from 'pizzip';

import '../App.css';

function percentile(arr : Array<number>, p : number) {
  if (arr.length === 0) return 0;
  if (typeof p !== 'number') throw new TypeError('p must be a number');
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];

  var index = (arr.length - 1) * p,
      lower = Math.floor(index),
      upper = lower + 1,
      weight = index % 1;

  if (upper >= arr.length) return arr[lower];
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}

function DocEditor() {

  // const [result, setResult] = useState([]);

  const editorObj = useRef<DocumentEditorContainerComponent>(null);

  const onCreated: () => void = () => {
    editorObj.current?.documentEditor.setDefaultCharacterFormat({ fontSize: 11, highlightColor: 'NoColor', underline: 'None', bold: false });
    fetch("/api/card")
      .then(res => res.json())
      .then(data => {
        let ranks = Object.values(data.rankedSents)
        data.sents.forEach((sent : string) => {
          let rank : number = data.rankedSents[sent];
          console.log(sent, rank);
          if (editorObj.current) {
            editorObj.current.documentEditor.selection.moveToDocumentEnd();
            editorObj.current.documentEditor.editor.insertText(sent);
            editorObj.current.documentEditor.search.find(sent);
            if (Number(rank) <= percentile(ranks as number[], 0.3)) {
              if (Number(rank) <= percentile(ranks as number[], 0.2)) {
                editorObj.current.documentEditor.selection.characterFormat.highlightColor = 'Turquoise';
              }
              else {
                editorObj.current.documentEditor.selection.characterFormat.highlightColor = 'NoColor';
              }
              editorObj.current.documentEditor.selection.characterFormat.fontSize = 11;
              editorObj.current.documentEditor.selection.characterFormat.underline = 'Single';
              editorObj.current.documentEditor.selection.characterFormat.bold = true;
            }
            else {
              editorObj.current.documentEditor.selection.characterFormat.highlightColor = 'NoColor'
              editorObj.current.documentEditor.selection.characterFormat.underline = 'None';
              editorObj.current.documentEditor.selection.characterFormat.fontSize = 6;
            }
          }
        });
      });
  }

  const onSave = () => {
    editorObj.current?.documentEditor.save("card", "Docx");
  }

  return (
    <div className="DocEditor">
      <button onClick={onSave} style={{marginBottom: 10}}>Save</button>
      <DocumentEditorContainerComponent 
        ref={editorObj} 
        created={onCreated}
        height='100vh' 
        width='100vw' 
        enableToolbar={true}
        serviceUrl='https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'>
        <Inject services={[Toolbar]} />
      </DocumentEditorContainerComponent>
    </div>
  );
}

export default DocEditor;
