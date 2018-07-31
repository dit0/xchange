/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 let app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      // let parentElement = document.getElementById(id);
      // let listeningElement = parentElement.querySelector('.listening');
      // let receivedElement = parentElement.querySelector('.received');

      // listeningElement.setAttribute('style', 'display:none;');
      // receivedElement.setAttribute('style', 'display:block;');

      // console.log('Received Event: ' + id);
    }
  };




//scripts by diego 27/06/18

//disable auto styling based on the device.
ons.disableAutoStyling();


//fake login
// let xlogin = function() {
//   let username = document.getElementById('username').value;
//   let password = document.getElementById('password').value;

//   if (username === '' && password === '') {
//     // ons.notification.alert("going");
//     document.querySelector("#navigator").pushPage("menu_login.html");

//   } else {
//     ons.notification.alert('Incorrect username or password.');
//   }
// };



//get the messages screen
function messages(){
  document.querySelector("#navigator").pushPage("views/messages.html");
}
function profile(){
  document.querySelector("#navigator").pushPage("views/profile.html");
}

//put the label value as title in the pages
document.addEventListener('prechange', function(event) {
  document.querySelector('#menu_login .center').innerHTML = event.tabItem.getAttribute('label');
});


//message button on messages.html
document.addEventListener('init', function(event) {
  let page = event.target;

  if (page.id === 'messages') {
    page.querySelector('#msg1').onclick = function() {
      document.querySelector('#navigator').pushPage('views/chat.html',
      {
        data: {
          title: 'Message from '
        }
      }
      );
      //console.log(document.querySelector('#navigator').data());
    };
  }

  if (page.id === 'chat') {
    messagesRef.off();
    messagesRef.on('child_added', function(data){
     const messageId = data.key;
     const messageObj = data.val(); 
     let message = messageObj.message;

     let decorator = `
     <p id=${messageId}>
     ${message}
     <button class="btn btn-danger">Delete</button>
     </p>`;
     $('.messages').append(decorator);

     $('button').click(function() {
      $(this).parent().fadeOut(function(){


        let id = $(this).attr('id');
        firebase.database().ref(`chat/${id}`).remove();
            });//remove();
    });
   });


  }


  // let showAlert = function() {
  //   ons.notification.alert('xChange!');
  // };

  page.querySelector("#login").onclick = function(){
    document.querySelector("#navigator").pushPage('views/login.html')
  } 
  page.querySelector("#register").onclick = function(){
    document.querySelector("#navigator").pushPage('views/register.html')
  } 
});


// ---------------------------------------------------------------

 // Initialize Firebase
 let config = {
  apiKey: "AIzaSyCHDgcVjF5nZGDuB7xM88v8CIT9uWmAiY0",
  authDomain: "xchange-e7223.firebaseapp.com",
  databaseURL: "https://xchange-e7223.firebaseio.com",
  projectId: "xchange-e7223",
  storageBucket: "xchange-e7223.appspot.com",
  messagingSenderId: "581413958183"
};
firebase.initializeApp(config);

//conect to the users database
let userRef = firebase.database().ref('/Users');
let userFacebookRef = firebase.database().ref('/Facebook-Users');
let userGamesRef = firebase.database().ref('/Games');
let messagesRef = firebase.database().ref('/chat');






//test if the database is working
/*
userRef.on("child_added", function(data){
  console.log(data);
  console.log(data.key);
  console.log(data.val());

});
*/

let xlogin = function(){
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const btnLogin = document.getElementById("btnLogin");
    //email and password
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    //sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));


  }

  let register2 = function(){
   const txtEmail = document.getElementById("txtEmail");
   const txtPassword = document.getElementById("txtPassword");
   const btnSignUp = document.getElementById("btnSignUp");
   const txtUser = document.getElementById("user");

   btnSignUp.addEventListener("click", e =>{
  //email and password
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const user = txtUser.value;
  const auth = firebase.auth();


  // let url = $("#profilepic").attr("src");
      //push the data without cryptography
      userRef.push({
        username: user,
        email: email,
        password: pass
        // profilepic: url

      });
      console.log(user + email + pass)
    //end register


    //sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  })
 }
 let logout = function(){
  firebase.auth().signOut();
  document.querySelector("#navigator").pushPage("index.html", {animation: 'fade'});
  localStorage.clear();


  console.log("logout");

}

firebase.auth().onAuthStateChanged(firebaseUser =>{
 const btnLogout = document.getElementById("btnLogout");

 if(firebaseUser){
  console.log("logged as: "+ firebaseUser.email);
  document.querySelector("#navigator").pushPage("menu_login.html", {animation: 'fade'});


} else {
  console.log("not logged in");

}
})


//image upload to database
document.addEventListener('init', function(event) {
  let page = event.target;

  if (page.id === 'login') {

//put the image and the name from localStorage on the screen


$(".fbPic").attr("src", localStorage.getItem("userpic"));

$(".user").text(localStorage.getItem("username"));
}//end page login

if (page.id === 'register') {

  let auth = firebase.auth();
  function handleFileSelect(evt) {
    let storageRef = firebase.storage().ref();
    evt.stopPropagation();
    evt.preventDefault();
    let file = evt.target.files[0];

    let metadata = {
      'contentType': file.type
    };

      // Push to child path.
      // [START oncomplete]
      storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then(function(url) {
          console.log('File available at', url);

          // [START_EXCLUDE]
          $('#profilepic').attr("src", url);
          // [END_EXCLUDE]
        });
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload', error);
        // [END onfailure]
      });
      // [END oncomplete]


    }




    document.getElementById('file').addEventListener('change', handleFileSelect, false);
    document.getElementById('file').disabled = false;

    // auth.onAuthStateChanged(function(user) {
    //   if (user) {
    //     console.log('Anonymous user signed-in.', user);
    //     document.getElementById('file').disabled = false;
    //   } else {
    //     console.log('There was no anonymous session. Creating a new anonymous user.');
    //       // Sign the user in anonymously since accessing Storage requires the user to be authorized.
    //       auth.signInAnonymously().catch(function(error) {
    //         if (error.code === 'auth/operation-not-allowed') {
    //           window.alert('Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
    //             'sign-in on your Firebase project.');
    //         }
    //       });
    //     }
    //   });
    //end file upload




  } //end if page register



  //profile page
  if (page.id === 'profile') {

    $(".fbPic").attr("src", localStorage.getItem("userpic"));
    $(".user").text(localStorage.getItem("username"));


    userGamesRef.on('child_added', function(data) {

      let gamesObj = data.val();
      console.log(gamesObj);
      const gameID = data.key;
      const mygamepic = gamesObj.gameurl;
      const mygamename = gamesObj.gamename;
      let gameinformation = `
      <li id=${gameID}>
      <span>${mygamename}</span>
      <img src=${mygamepic} style=width:100%>
      </li>`;
      $(".mygames").prepend(gameinformation);

    });

    // $('.submit-game-pic').click(function(event){
    //   console.log("submit");
    //   event.preventDefault();

    //   document.querySelector("#navigator").resetToPage("views/profile.html");     


    // })

    let auth = firebase.auth();

    function handleFileSelect(evt) {
      let storageRef = firebase.storage().ref();
      evt.stopPropagation();
      evt.preventDefault();
      let file = evt.target.files[0];
      let metadata = {
        'contentType': file.type
      };


      // Push to child path.
      // [START oncomplete]
      storageRef.child('games-pics/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then(function(url) {
          console.log('File available at', url);
          // [START_EXCLUDE]
          $('#game-pic').attr("src", url);
          gamename = $("#game-name").val().toLowerCase();
          userGamesRef.push({
           username: "user 2",
           gamename: gamename,
           gameurl: url
         });
          ons.notification.toast('Upload Complete ',{ timeout: 2000 });
          // [END_EXCLUDE]
        });
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]
    }




    document.getElementById('game-pic-up').addEventListener('change', handleFileSelect, false);
    // document.getElementById('game-pic-up').disabled = true;

/*
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('Anonymous user signed-in.', user);
        document.getElementById('file').disabled = false;
      } else {
        console.log('There was no anonymous session. Creating a new anonymous user.');
          // Sign the user in anonymously since accessing Storage requires the user to be authorized.
          auth.signInAnonymously().catch(function(error) {
            if (error.code === 'auth/operation-not-allowed') {
              window.alert('Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
                'sign-in on your Firebase project.');
            }
          });
        }
      });

      */

    }//end profile



//put the images from the storage in the homepage
if (page.id === 'home') {

  userGamesRef.on('child_added', function(data) {

    let gamesObj = data.val();
      // console.log(gamesObj);
      const gameID = data.key;
      const mygamepic = gamesObj.gameurl;
      const mygamename = gamesObj.gamename;
      let gameinformation = `
      <ons-carousel-item id=${gameID} modifier="nodivider" class="games-home" onclick=gameProfile(this.id)>
      <div class=thumbnail>
      <img src=${mygamepic} class=list-item__thumbnail>
      </div>
      <div class="games-home_title">${mygamename}</div>
      </ons-carousel-item>`;
      setTimeout(function(){
        $(".ons-swiper-target").append(gameinformation);
      }, 10);


    });



}
if (page.id === 'gameprofile') {
  page.querySelector('#dm').onclick = function() {
    document.querySelector('#navigator').pushPage('views/chat.html',
    {
      data: {
        title: 'Message from '
      }
    }
    );
      //console.log(document.querySelector('#navigator').data());
    };
  }


  if (page.id === 'map') {
   initMap();
 }
});
//open the game info
// let  gameInfo;
let gameProfile = function(id){
  console.log("game profile was clicked "+ id);

  document.querySelector('#navigator').pushPage('views/gameprofile.html',{data:id
  }).then(function(url){

    // $(".gamename").html("id is "+ id);
    firebase.database().ref("/Games/").child(id).on("value", function(snapshot) {
      $(".gamename").html(snapshot.val().gamename);
      $(".game-pic").attr("src", snapshot.val().gameurl);
      $(".gameuser").html(`From ${snapshot.val().username}`)
    });


  });


  

}

//search function
function search(){

  //clear previous search
  $(".searchResults .list-item").children().remove();
  
  let searchInput = document.getElementById('search-input').value.toLowerCase();
  console.log("search is " + searchInput);

  let searchObj = [];

  userGamesRef.on('value',function(snapshot){
    //put all the data from the games table into an array
    snapshot.forEach(function(data){
     let allGamesResults = data.val();
     let allGamesNames = allGamesResults.gamename;
     let allGamesUrl = allGamesResults.gameurl;
     searchObj.push({id: data.key, gamename: allGamesNames, gameurl :allGamesUrl});

   })

  })

  //new array only with the search 
  let searchResult = searchObj.filter(x => x.gamename.includes(searchInput));
  console.log(searchResult);


  if(!searchResult.length){
    ons.notification.toast('Game not found',{ timeout: 3000 });
  } else{
    //put the content of the array in the page
    searchResult.forEach(function(data){
      let gameSearchId = data.id;
      let gameSearchName = data.gamename;
      let gameSearchUrl = data.gameurl;


      let htmlSearch = `
      <ons-list-item tappable class="list-item" id=${gameSearchId} onclick=gameProfile(this.id)>
      <div class="left list-item__left">
      <img class="list-item__thumbnail" src="${gameSearchUrl}">
      </div>
      <div class="center list-item__center">
      <span class="list-item__title">${gameSearchName}</span>
      </div>
      </ons-list-item>
      `;

      $(".searchResults").append(htmlSearch);
    })

}//ends if

}//ends function search 

//put data on firebase table
function register(){

  let user = $("#user").val();
  let email = $("#txtEmail").val();
  let password = $("#txtPassword").val();
  let cnf_pss = $("#cnf_pss").val();
  // let url = $("#profilepic").attr("src");
      //push the data without cryptography
      userRef.push({
        username: user,
        email: email,
        password: password
        // profilepic: url

      });
      console.log(user + email + password + cnf_pss)
    }//end register







//facebook login - https://firebase.google.com/docs/auth/web/facebook-login
function fblogin(){
  let provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithRedirect(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  let token = result.credential.accessToken;

  // The signed-in user info.
  let user = result.user;
// console.log(user);

//put the name, email and photo on firebase
userFacebookRef.push({
  name: user.displayName,
  email: user.email,
  photo: user.photoURL
});

//put the profile pic from the fabook stored in firebase to the page
let userpic = localStorage.setItem('userpic', user.photoURL);
console.log(localStorage.getItem("userpic"));
$(".fbPic").attr("src", localStorage.getItem("userpic"));

//name from firebase to the page
let username = localStorage.setItem("username", user.displayName);
console.log(localStorage.getItem("username"));
$(".user").text("Welcome " + localStorage.getItem("username"));


}).catch(function(error) {

  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
  ons.notification.toast('Upload Complete ',{ timeout: 2000 });



  ons.notification.toast("error mail: " + email);
// console.log("error user: " + user);
ons.notification.toast("error code: "+  errorCode);
ons.notification.toast("error message: "+ errorMessage);


});

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    let token = result.credential.accessToken;
    document.querySelector("#navigator").pushPage("menu_login.html", {animation: 'fade'});
    // ...
  }
  // let userRef = firebase.database().ref('/Users');

  // The signed-in user info.
  let user = result.user;
  console.log("User data: "+ user);
}).catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
});

}



//firebase messages is not working and I fucking don't know why
/*
let messaging = firebase.messaging();
messaging.requestPermission().then(function(){
  console.log("permissions");
  return messaging.getToken();
}).then(function(token){
  console.log(token)
}).catch(function(err){
  console.log(err);
});
*/

function chat(){

  let msgVal = $("#chat_msg").val();
  messagesRef.push({message: msgVal});
  $("#chat_msg input").val('').focus();


}

// let map, marker, myLatlng;

// function mapa() {

//   let langara = {

//    lat: 49.224596,
//    lng: -123.110314
//  } 
//  var mapOptions = {
//   center: langara,
//   zoom: 18
// };

// var marker = {
//   position: langara,

//   title: "I'm here!"
// };

// map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions, marker);
// console.log("inside");

// }


var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 49.224596, lng: -123.110314},
    zoom: 18
  });
  infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }