firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log(uid);

    var userEmail = user.email;
    console.log(userEmail);

    firebase
      .firestore()
      .collection("Users")
      .doc(uid)
      .get()
      .then((doc) => {
        let userName = doc.data().userName;
        let userEmail = doc.data().emailAddress;
        let handle = "@" + userName;
        document.getElementById("Name").innerText = userName;
        document.getElementById("email").innerText = handle;
      });
    document.getElementById("Tweet").onclick = function () {
      let tweets = document.getElementById("tweets").value;
      // let timestamp = new Date()
      let sendtweet = firebase.firestore().collection('Tweets').doc();
        sendtweet.set({
          tweets: tweets,
          userId: uid,
          tweetId: sendtweet.id
          // time: timestamp
        })
        .then(() => {
          window.location.reload();
        });
    };
    document.getElementById("logout").onclick = function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("you are logged out");
          window.location.href = "/login.html";
        })

        .catch((error) => {
          let errorMessage = error.message;
          console.log(errorMessage);
        });
    };
    firebase
      .firestore()
      .collection("Users")
      .get()
      .then((querryUser) => {
        querryUser.forEach((userDoc) => {
          let user = userDoc.data().userName;
          let userId = userDoc.data().userId;
          let handle = "@" + user;

          firebase
            .firestore()
            .collection("Tweets")
            .get()
            .then((querryTweets) => {
              let content = "";

              querryTweets.forEach((tweetDoc) => {
                let tweetUserId = tweetDoc.data().userId;
                let tweet = tweetDoc.data().tweets;
                let tweetid = tweetDoc.data().tweetId
            
                if (userId == tweetUserId) {
                  console.log(tweet);
                  content += '<div class="wehh" id="tweetContent" onclick="navigateToTweetPage(\''+tweetid+'\')">';
                  content += "<p id = twitter>" + user + " " + "<span id='handle'>" + handle + "</span>"+ "</p>";
                  // content += "<p>" + handle + "</p>";
                  content += "<p>" + tweet + "</p>";

                  content += "</div>";
                }

              });
              $("#container").append(content);
            });
        });
        window.navigateToTweetPage = function(tweetid){
          console.log(tweetid);
          window.location.href = '/change.html' + '?' + tweetid
        }
        
      });
  } else {
    window.location.href = "/login.html";
  }
});
