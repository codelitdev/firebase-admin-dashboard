import React from "react";
import { API_URL } from "./globals.js";

export default class Dashboard extends React.Component {
  constructor(props) {
    super();

    this.state = {
      val: ""
    };

    // this.initNetworkRequest = this.initNetworkRequest.bind(this);
    this.sendPost = this.sendPost.bind(this);
  }

  initNetworkRequest(url, requestbody, callback = null) {
    this.setState({ networkrequest: true }, function() {
      fetch(url, {
        method: "post",
        headers: {
          Accept:
            "application/json, application/xml, text/plain, text/html, *.*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          // Embedding the JWT token inside every request for authentication
          Object.assign({}, requestbody, { token: this.props.token })
        )
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ networkrequest: false });

          // If we want to do something extra with the response
          callback(res);
        })
        .catch(err => this.setState({ networkrequest: false }));
    });
  }

  // You can initiate custom AJAX requests from the dashboard by writing methods
  // like this.
  // NOTE: Don't forget to bind the methods in the constructor if you are using
  // them in JSX.
  sendPost() {
    this.initNetworkRequest(
      // the URL remains the same
      `${API_URL}/admin`,
      {
        // Substitute your POST data here.
        value: this.state.val
      },
      // You can pass custom handlers which execute after getting response from
      // the server
      response => alert(response.message)
    );
  }

  render() {
    return (
      <div>
        <a href="/">Firebase Admin Dashboard</a>
        {/* A Sample Widget */}
        <section>
          <header>
            <h4>Sample Widget</h4>
          </header>
          <input
            type="text"
            placeholder="Type something"
            onChange={e => this.setState({ val: e.target.value })}
          />
          <button onClick={this.sendPost}>Make request</button>
        </section>
      </div>
    );
  }
}
