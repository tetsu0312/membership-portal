import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔽 Firebase設定（コンソールからコピペ）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const memberNo = document.getElementById("memberNo").value;
  const birthday = document.getElementById("birthday").value;

  try {
    // ① 認証ユーザー作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ② Firestoreに会員情報保存（uidをドキュメントIDに）
    await setDoc(doc(db, "users", user.uid), {
      name,
      memberNo,
      birthday,
      email
    });

    message.textContent = "登録完了！";
    message.style.color = "green";

    // 次はログインページへ飛ばしてもOK
    // location.href = "login.html";

  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
});
