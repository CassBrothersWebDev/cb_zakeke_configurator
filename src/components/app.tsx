import React, { FunctionComponent } from "react";
import styled from "styled-components";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
} from "zakeke-configurator-react";
import Selector from "./selector";
import Overlay from "./overlay";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  height: 100%;
  padding: 40px;
`;

const zakekeEnvironment = new ZakekeEnvironment();

function isWebGLSupported() {
  try {
    var canvas = document.createElement("canvas");
    return !!window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch(e) {
    return false;
  }
}

const App: FunctionComponent<{}> = () => {
  if (!isWebGLSupported()) {
    return (
      <div>
        <h1>Error: WebGL is not supported on this browser.</h1>
        <h3>Please try another broswer or update this browser to the latest version</h3>
      </div>
    );
  } else {  
    return (
      <ZakekeProvider environment={zakekeEnvironment}>
        <Layout className="container">
          {
            //<Overlay />
          }
          <div className="viewerContainer">
            <ZakekeViewer />
          </div>
          <Selector />
        </Layout>
      </ZakekeProvider>
    );
  }
};

export default App;
