import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      errors: null
    };
    this.codeChange = this.codeChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  postRequest() {
    var http = new XMLHttpRequest();
    var url = "/api/upload";
    var body = JSON.stringify({ code: this.state.code });
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/json");
    var _this = this;
    http.onreadystatechange = function(response) {
      if (http.readyState == 4 && http.status == 200) {
        console.log("HTTP request successful!");
        const response = JSON.parse(http.response);
        if (response.errors) {
          _this.setState({ errors: response.errors });
        } else {
          _this.setState({errors: null})
        }
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
    let errorsElements = [];
    if (this.state.errors) {
      const errors = this.state.errors;
      for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        let message = error.message;
        errorsElements.push(<li style={{whiteSpace: "pre-wrap"}}>{message}</li>);
      }
    }

    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%", padding: "10px" }}>
          <div>
            <textarea
              value={this.state.code}
              style={{ width: 500, height: 300 }}
              onChange={this.codeChange}
            />{" "}
            &nbsp;&nbsp;
            <button onClick={this.submitCode}>Submit</button>
          </div>
        </div>
        <div style={{ width: "100%", padding: "10px" }}>
          Errors:
          <div>
            <ol>{errorsElements}</ol>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("react-container"));
