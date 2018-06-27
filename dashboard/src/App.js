import React, { Component } from "react";
import "./App.css";
import LoginScreen from "./LoginScreen.js";
import Dashboard from "./Dashboard.js";

// Used for authentication purposes.
//
// When the app is reloaded this becomes null hence the user is logged out on
// every page reload.
// TODO Store the JWT in a cookie or localstorage.
const TokenContext = React.createContext({
  token: "",
  setToken: token => {}
});

class App extends Component {
  constructor(props) {
    super(props);

    this.setToken = token => {
      this.setState({
        token: token
      });
    };

    // State also contains an updater function so it will
    // be passed down into the context provider
    this.state = {
      token: "",
      setToken: this.setToken
    };
  }

  render() {
    return (
      <TokenContext.Provider value={this.state}>
        <div className="container">
          <TokenContext.Consumer>
            {({ token, setToken }) => {
              return token ? (
                <Dashboard token={token} />
              ) : (
                <LoginScreen onAuth={setToken} />
              );
            }}
          </TokenContext.Consumer>
        </div>
      </TokenContext.Provider>
    );
  }
}

export default App;
