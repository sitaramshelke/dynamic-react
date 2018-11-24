import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ""
    };
    this.codeChange = this.codeChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  postRequest() {
    var http = new XMLHttpRequest();
    var url = "/api/upload";
    var body = JSON.stringify({code: this.state.code});
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");
    var _this = this;
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        console.log("HTTP request successful!");
        // _this.setState({code: ""})
      }
    };
    http.send(body);
  }

  codeChange(e) {
    this.setState({ code: e.target.value });
  }

  submitCode() {
    // console.log(this.state.code);
    this.postRequest();
  }

  render() {
    return (
      <div>
        <textarea
          value={this.state.code}
          style={{ width: 500, height: 300 }}
          onChange={this.codeChange}
        />{" "}
        &nbsp;&nbsp;
        <button onClick={this.submitCode}>Submit</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-container"));
