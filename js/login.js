import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQKXq7z-tgfz5H38G-GLpZWsEG3MA8i2Q",
  authDomain: "user-login-portal.firebaseapp.com",
  projectId: "user-login-portal",
  storageBucket: "user-login-portal.firebasestorage.app",
  messagingSenderId: "183527442150",
  appId: "1:183527442150:web:15341cf06a216c10ab9d27"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const emailInput = document.getElementById("email");

/* =========================
   🔁 ページ表示時：自動復元
========================= */
const savedEmail = localStorage.getItem("savedEmail");
if (savedEmail) {
  emailInput.value = savedEmail;
}

/* =========================
   🔐 ログイン処理
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = emailInput.value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // ✅ 成功したら必ず保存
    localStorage.setItem("savedEmail", email);

    location.href = "./mypage.html";

  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        message.textContent =
          "メールアドレスまたはパスワードが正しくありません";
        break;

      case "auth/invalid-email":
        message.textContent = "メールアドレスの形式が正しくありません";
        break;

      case "auth/too-many-requests":
        message.textContent =
          "試行回数が多すぎます。しばらくしてから再度お試しください";
        break;

      default:
        message.textContent = "ログインに失敗しました。もう一度お試しください";
    }

    message.style.color = "red";
  }
});