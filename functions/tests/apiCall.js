// Helper function to make api calls for testing

const request = require("request");

module.exports = (data, url = "http://localhost:5000/login") =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: url,
        form: data
      },
      (err, res, body) => {
        if (!err) {
          resolve(body);
        } else {
          reject(err);
        }
      }
    );
  });
