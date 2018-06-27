// Tests for login related functionality

const apiCall = require("./apiCall.js");

test("Wrong user ID in request", async () => {
  const data = JSON.parse(await apiCall({ user: "root1" }));
  expect(data.message).toEqual("Username or password incorrect");
});

test("Password missing", async () => {
  const data = JSON.parse(await apiCall({ user: "root" }));
  // console.log(data);
  expect(data.message).toEqual("Password missing");
});

test("Password does not match", async () => {
  const data = JSON.parse(
    await apiCall({
      user: "root",
      password: "lol2"
    })
  );
  expect(data.auth).toEqual(false);
});

test("Successfull log in", async () => {
  const data = JSON.parse(
    await apiCall({
      user: "root",
      password: "lol"
    })
  );

  expect(data.auth).toEqual(true);
});

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
