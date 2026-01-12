import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

const form = document.getElementById("resetForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value;

  try {
    await sendPasswordResetEmail(auth, email);

    message.textContent = "再設定メールを送信しました。受信ボックスをご確認ください。";
    message.style.color = "green";
  } catch (error) {
    // セキュリティ上「存在しないメール」とバレないよう同じ文言にするのが安全
    switch (error.code) {
      case "auth/invalid-email":
        message.textContent = "メールアドレスが正しくありません。";
        break;
      default:
        message.textContent = "再設定メールを送信できませんでした。時間をおいて再度お試しください。";
    }
    message.style.color = "red";
  }
});