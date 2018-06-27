// Tests for API related functionalities

const apiCall = require("./apiCall.js");

test("Auth middleware no token", async () => {
  const res = JSON.parse(
    await apiCall(
      {
        token: ""
      },
      "http://localhost:5000/admin"
    )
  );

  expect(res.message).toEqual("No token provided");
});

test("Auth middleware invalid token", async () => {
  const data = JSON.parse(
    await apiCall(
      {
        token: "invalid_token"
      },
      "http://localhost:5000/admin"
    )
  );

  console.log(data);
  expect(data.message).toEqual("There was a problem");
});

test("Auth middleware valid token", async () => {
  const data = JSON.parse(
    await apiCall({
      user: "root",
      password: "lol"
    })
  );

  expect(data.auth).toEqual(true);

  // create new request with the obtained jwt
  const res = JSON.parse(
    await apiCall(
      {
        token: data.token
      },
      "http://localhost:5000/admin"
    )
  );

  expect(res.message).toEqual("passed");
});
