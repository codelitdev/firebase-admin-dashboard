import React from "react";
import { API_URL } from "./globals.js";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      pass: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    fetch(`${API_URL}/login`, {
      method: "post",
      headers: {
        Accept: "application/json, application/xml, text/plain, text/html, *.*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: this.state.user, password: this.state.pass })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.auth) {
          this.props.onAuth(res.token);
        } else {
          alert(res.message);
        }
      });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter user id"
          onKeyUp={e => {
            this.setState({ user: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="Enter password"
          onKeyUp={e => {
            this.setState({ pass: e.target.value });
          }}
        />
        <button type="submit" onClick={this.onSubmit}>
          Sign in
        </button>
      </div>
    );
  }
}
