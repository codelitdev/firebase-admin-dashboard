// Cloud functions for performing tasks based on what is written
// to /actions/{user_phone}/command.
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const tambola = require("tambola-generator");

// Helper function to check if all members for array target exists in array source.
// Returns true or false.
const arrayMatcher = (source, target) => {
  if (!target) {
    return false;
  } else {
    // .every() method returns true when operated on an empty array, hence the if
    // check.
    // Read: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
    return target.every(val => source.includes(val));
  }
};

module.exports = functions.firestore
  .document("/actions/{userid}")
  .onWrite((change, context) => {
    const data = change.after.data();
    const prevData = change.before.data();
    const userid = context.params.userid;

    // We'll only update if the action has changed.
    // This is crucial to prevent infinite loops.
    if (data.action === "completed") return null;

    switch (data.action) {
      case "nominate": {
        const ticketRef = `/admin/gamestats/players/${userid}`;

        // 0. Check if document already exists.
        // This assumes that the ticket entry is always present when this nomination
        // function runs successfully
        return admin
          .firestore()
          .doc(ticketRef)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              return null;
            } else {
              // 1. Generate a new ticket
              const ticket = tambola.getTickets(1)[0];
              const ticArr = [...ticket[0], ...ticket[1], ...ticket[2]];

              // 2. Set the ticket to '/admin/gamestats/{userid}/ticket'
              return admin
                .firestore()
                .doc(ticketRef)
                .set({ ticket: ticArr, crossed: [], prizes: [] });
            }
          })
          .then(() => {
            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: "Success"
            });
          })
          .catch(err => {
            console.log(err);

            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: err.message
            });
          });
      }
      case "claim": {
        const gameRef = admin
          .firestore()
          .collection("admin")
          .doc("game");

        return admin
          .firestore()
          .runTransaction(transaction =>
            // this code may get re-run multiple times if there are conflicts
            transaction.get(gameRef).then(gameSnapshot => {
              if (!gameSnapshot.exists) return null;

              const gameData = gameSnapshot.data();

              // get user's gamestat
              // const ticketRef = `/admin/gamestats/players/${userid}`;
              const ticketRef = admin
                .firestore()
                .collection("admin")
                .doc("gamestats")
                .collection("players")
                .doc(`${userid}`);
              // .doc(`/admin/gamestats/players/${userid}`);

              const userRef = admin
                .firestore()
                .collection("users")
                .doc(`${userid}`);

              userPromise = transaction.get(userRef);
              ticketPromise = transaction.get(ticketRef);

              return Promise.all([ticketPromise, userPromise]).then(values => {
                const userGameStatSnapshot = values[0];
                const userSnapshot = values[1];

                if (!userGameStatSnapshot.exists) return null;
                const userGameStats = userGameStatSnapshot.data();

                if (!userSnapshot.exists) return null;
                const user = userSnapshot.data();

                // check if prizes are available
                let prize = null,
                  prizeIndex = -1;
                for (let x = 0; x < gameData.prizes.length; x++) {
                  if (gameData.prizes[x].name === data.name) {
                    prize = gameData.prizes[x];
                    prizeIndex = x;
                  }
                }

                // if no prize is found or the number of prizes remaining of this
                // type is zero, just return
                if (!(prize && parseInt(prize.number) > 0)) {
                  throw new Error("No such prize left");
                  // return change.after.ref.set({
                  //   action: "completed",
                  //   call: data.action,
                  //   response: "No such prize left"
                  // });
                }

                // check if the user has claimed the same prize already, if yes
                // just return
                const userPrizeIndex = userGameStats.prizes.indexOf(data.name);
                if (userPrizeIndex > -1) {
                  throw new Error("User already claimed the prize");
                  // return change.after.ref.set({
                  //   action: "completed",
                  //   call: data.action,
                  //   response: "User already claimed the prize"
                  // });
                }

                // ticket matching logic goes here.
                let numbersToBeChecked = null;

                // find all non zero numbers in user's ticket
                switch (data.name) {
                  case "early_five": {
                    //TODO test logic
                    numbersToBeChecked = gameData.opened.slice(0, 5);
                    break;
                  }
                  case "top_line": {
                    // js range [0, 9)
                    numbersToBeChecked = userGameStats.ticket
                      .slice(0, 9)
                      .filter(val => val !== 0);
                    break;
                  }
                  case "middle_line": {
                    // js range [9, 18)
                    numbersToBeChecked = userGameStats.ticket
                      .slice(9, 18)
                      .filter(val => val !== 0);
                    break;
                  }
                  case "bottom_line": {
                    // js range [18, 27)
                    numbersToBeChecked = userGameStats.ticket
                      .slice(18, 27)
                      .filter(val => val !== 0);
                    break;
                  }
                  case "four_corners": {
                    const topTicketLine = userGameStats.ticket
                      .slice(0, 9)
                      .filter(val => val !== 0);
                    const bottomTicketLine = userGameStats.ticket
                      .slice(18, 27)
                      .filter(val => val !== 0);

                    numbersToBeChecked = [
                      topTicketLine.shift(),
                      topTicketLine.pop(),
                      bottomTicketLine.shift(),
                      bottomTicketLine.pop()
                    ];

                    break;
                  }
                  case "full_house": {
                    // Technically we don't need this for a full house check. We
                    // can just compare the user's "crossed" array with game's
                    // "opened" array but for making the logic seamless, this is
                    // a redundant check we are going to perform.
                    const topTicketLine = userGameStats.ticket
                      .slice(0, 9)
                      .filter(val => val !== 0);
                    const middleTicketLine = userGameStats.ticket
                      .slice(9, 18)
                      .filter(val => val !== 0);
                    const bottomTicketLine = userGameStats.ticket
                      .slice(18, 27)
                      .filter(val => val !== 0);

                    numbersToBeChecked = [
                      ...topTicketLine,
                      ...middleTicketLine,
                      ...bottomTicketLine
                    ];
                    break;
                  }
                  default: {
                    // no appropriate prize found
                    console.error("No such prize found: ", data.name);
                    throw new Error("No such prize found");
                  }
                }

                // check if the all the top line numbers from ticket are in
                // user's crossed array and in opened array
                if (numbersToBeChecked) {
                  console.log(numbersToBeChecked);
                  if (
                    arrayMatcher(userGameStats.crossed, numbersToBeChecked) &&
                    arrayMatcher(gameData.opened, numbersToBeChecked)
                  ) {
                    // decrease the number of prizes left for this particular prize
                    gameData.prizes[prizeIndex].number = String(
                      gameData.prizes[prizeIndex].number - 1
                    );
                    transaction.update(gameRef, { prizes: gameData.prizes });

                    // put the prize in user's gamestat's prizes array
                    userGameStats.prizes.push(data.name);
                    transaction.update(ticketRef, {
                      prizes: userGameStats.prizes
                    });

                    // add the credits to user's account
                    transaction.update(userRef, {
                      credit: parseInt(prize.amount) + (user.credit || 0)
                    });
                  } else {
                    throw new Error(`Failed to claim ${data.name}`);
                  }
                } else {
                  console.error(
                    "No suitable numbers found to run claim logic",
                    data.name
                  );
                  throw new Error("No suitable numbers found");
                }

                return null;
              });
            })
          )
          .then(() => {
            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: "Success"
            });
          })
          .catch(err => {
            console.error(err.message);

            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: err.message
            });
          });
      }
      case "checked": {
        const ticketRef = admin
          .firestore()
          .collection("admin")
          .doc("gamestats")
          .collection("players")
          .doc(userid);

        return admin
          .firestore()
          .runTransaction(transaction =>
            transaction.get(ticketRef).then(doc => {
              if (doc.exists) {
                console.log(doc.data());
                // add or remove data from crossed array
                const { crossed, ticket } = doc.data();
                const { checked, number } = data;
                // console.log(crossed, checked, number);

                if (checked) {
                  // checked is set, hence add to crossed

                  // 0. See if the number is in the ticket
                  const index = ticket.indexOf(number);
                  if (index > -1) {
                    // 1. Add to crossed, only if not added
                    if (crossed.indexOf(number) === -1) {
                      return transaction.update(ticketRef, {
                        crossed: [...crossed, number]
                      });
                    } else {
                      // Since the operation is non-fatal, there is no need to
                      // return an error. We can safely ignore this.
                      return null;
                    }
                  } else {
                    throw new Error("Number does not exist in ticket");
                  }
                } else {
                  // remove from already crossed numbers
                  const index = crossed.indexOf(number);
                  if (index > -1) {
                    crossed.splice(index, 1);

                    // update the data on server
                    return transaction.update(ticketRef, { crossed });
                  } else {
                    throw new Error("Number does not exist in crossed");
                  }
                }
              } else {
                throw new Error("Ticket does not exists");
              }
            })
          )
          .then(() => {
            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: "Success"
            });
          })
          .catch(err => {
            console.error(err.message);

            return change.after.ref.set({
              action: "completed",
              call: data.action,
              response: err.message
            });
          });
      }
    }

    // mark the action as complete so that we can break out of infinite loop
    return change.after.ref.set({
      action: "completed",
      call: data.action,
      response: "No suitable action found"
    });
  });
