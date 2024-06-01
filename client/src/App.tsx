import React, { useRef, useEffect } from 'react';
import {DocumentEditorContainerComponent, Inject, Toolbar} from '@syncfusion/ej2-react-documenteditor';
import WebViewer, { Core } from '@pdftron/webviewer';

import PizZip from 'pizzip';

import './App.css';

function App() {

  let editorObj: DocumentEditorContainerComponent | null;

  const onSave = ()=>{
    editorObj?.documentEditor.save("card", "Docx");
  }

  return (
    <div className="App">
      <button onClick={onSave} style={{marginBottom: 10}}>Save</button>
      <DocumentEditorContainerComponent 
        ref={(ins=>editorObj=ins)} 
        height='100vh' 
        width='100vw' 
        enableToolbar={true}
        serviceUrl='https://ej2services.syncfusion.com/production/web-services/api/documenteditor/'>
        <Inject services={[Toolbar]} />
      </DocumentEditorContainerComponent>
    </div>
  );
}

export default App;
