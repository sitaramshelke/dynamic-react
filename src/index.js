import React from "react";
import ReactDOM from "react-dom";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { AllowedModules } from "./allowedModules";
import * as DataStore from "./datastore";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "render('', document.getElementById('fake-element'))",
      scope: {}
    };
  }

  componentDidMount() {
    let scope = {};
    for (let i = 0; i < AllowedModules.length; i++) {
      let module = AllowedModules[i];
      scope[module.name] = module;
    }
    const code = DataStore.code;
    this.setState({ scope, code });
  }

  render() {
    return (
      <div>
        <LiveProvider
          code={this.state.code}
          scope={this.state.scope}
          noInline={true}
        >
          <LiveError />
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-container"));
