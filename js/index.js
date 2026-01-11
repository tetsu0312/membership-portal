import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQKXq7z-tgfz5H38G-GLpZWsEG3MA8i2Q",
  authDomain: "user-login-portal.firebaseapp.com",
  projectId: "user-login-portal",
  storageBucket: "user-login-portal.firebasestorage.app",
  messagingSenderId: "183527442150",
  appId: "1:183527442150:web:15341cf06a216c10ab9d27",
  measurementId: "G-NG9H5NJEPH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const guest = document.getElementById("guest");
const member = document.getElementById("member");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // ログイン済み
    guest.style.display = "none";
    member.style.display = "block";

    // 自動でマイページへ飛ばしたい場合はこれ👇
    // location.href = "./mypage.html";
  } else {
    // 未ログイン
    guest.style.display = "block";
    member.style.display = "none";
  }
});
