firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log(uid);
    var selectId = decodeURIComponent(window.location.search);
    var selectTweetId = selectId.substring(1);

    
    
    

    firebase
      .firestore()
      .collection("Users")
      .get()
      .then((querryUser) => {
        querryUser.forEach((userDoc) => {
          let user = userDoc.data().userName;
          let userId = userDoc.data().userId;
          console.log(user);

          firebase
            .firestore()
            .collection("Tweets")
            .get()
            .then((querryTweets) => {
              let content = "";

              querryTweets.forEach((tweetDoc) => {
                let tweetUserId = tweetDoc.data().userId;
                let tweet = tweetDoc.data().tweets;
                let tweetid = tweetDoc.data().tweetId;
                let handle = "@" + user;
                
                if ((userId == tweetUserId) & (tweetid == selectTweetId)) {
                  console.log(tweetid);
                  content += '<div class="wehh" id="tweetContent">';
                  content +=
                    "<p>" +
                    user +
                    " " +
                    "<span id='handle'>" +
                    handle +
                    "</span>" +
                    "</p>";
                  // content += "<p>" + handle + "</p>";
                  content += "<p>" + tweet + "</p>";

                  content += "</div>";
                }

              });
              $("#container").append(content);

              

                    firebase
                      .firestore()
                      .collection("Comments")
                      .get()
                      .then((querryComment) => {
                        querryComment.forEach((commentDoc) => {
                          let commentUserId = commentDoc.data().userId;
                          let comment = commentDoc.data().comments;
                          let tweetid = commentDoc.data().tweetId;
                          // let commentid = commentDoc.data().commentId;
                          let commentTweetid = commentDoc.data().commentTweetId;
                          let content = " ";
                          if (
                            (userId == commentUserId && commentTweetid == selectTweetId) 
                            
                            ) {
                            console.log(comment);
                            content += "<div class = 'commentcontainer' >";
                            content += "<p>" + comment + "</p>";
                            content += "</div>";
                          }
                          
                          $("#commentcontainer").append(content);
                        });
                      });
                  });
        });
  
        window.navigateToTweetPage = function (tweetid) {
          console.log(tweetid);
          window.location.href = "/change.html" + "?" + tweetid;
        };
      });
      document.getElementById("submit").onclick = function () {
        firebase
          .firestore()
          .collection("Comments")
          .doc()
          .get()
          .then(() => {
            let comment = document.getElementById("comment").value;
            console.log(comment);
            let sendComment = firebase.firestore().collection("Comments").doc();
            sendComment
  
              .set({
                comments: comment,
                userId: uid,
                commentId: sendComment.id,
                commentTweetId: selectTweetId
              })
              .then(() => {
                window.location.reload();
              });
          });
      };
    } else {
      window.location.href = "/login.html";
    }
  });
