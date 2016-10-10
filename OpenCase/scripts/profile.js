var config = {
    apiKey: "AIzaSyBnT4uYoOgs0Gl6F5_AtzY-q9hhM8z__E4",
    authDomain: "admob-app-id-8282025074.firebaseapp.com",
    databaseURL: "https://admob-app-id-8282025074.firebaseio.com",
    storageBucket: "admob-app-id-8282025074.appspot.com",
    messagingSenderId: "917984410977"
};
firebase.initializeApp(config);

function register() {
    var email = $("#email").val() || "";
    var password = $("#password").val() || "";
    if (email == "" || password == "") {
        return false;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log("Error! ", error.message);
    })
    setTimeout(function() {
        if (firebase.auth().currentUser != null) {
            var ava = Player.avatar;
            if (/^\d+\.\w{3}$/.test(ava)) ava = "../images/ava/" + ava;
            firebase.auth().currentUser.updateProfile({
                displayName: Player.nickname,
                photoURL: ava
            }).then(function() {
                var userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);

                var userSettingsRef = userRef.child('settings');
                userSettingsRef.child('language').set(Settings.language);
                userSettingsRef.child('sounds').set(Settings.sounds);
                userSettingsRef.child('drop').set(Settings.drop);

                var privateRef = userRef.child('private');
                privateRef.child('points').set(Player.points);
                privateRef.child('double').set(Player.doubleBalance);

                var publicRef = userRef.child('public');
                publicRef.child('nickname').set(Player.nickname);
                publicRef.child('avatar').set(ava);

            }, function(error) {
                console.log('Error! ' + error);
            });
        }
    }, 2000);
}

function syncInventory() {

}

function showProfile(uid, callback) {
    var userInfoRef = firebase.database().ref('users/' + uid + '/public');
    userInfoRef.once('value').then(function(snapshot) {
        var userInfo = snapshot.val();
        callback(userInfo);
    })
}

function login() {
    var email = $("#email").val() || "";
    var password = $("#password").val() || "";
    if (email == "" || password == "") {
        return false;
    }

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log("Error! ", error.message);
    });
}

function XSSreplace(text) {
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/"/g, '&quot;');
    text = text.replace(/'/g, '&#x27;');
    text = text.replace(/\//g, '&#x2F;');
    return text;
}