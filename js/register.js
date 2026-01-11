import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function generateUniqueMemberNo(db) {
  while (true) {
    const memberNo = generateMemberNo(6);

    const q = query(
      collection(db, "users"),
      where("memberNo", "==", memberNo)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return memberNo; // 被ってない → 採用！
    }
  }
}

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQKXq7z-tgfz5H38G-GLpZWsEG3MA8i2Q",
  authDomain: "user-login-portal.firebaseapp.com",
  projectId: "user-login-portal",
  storageBucket: "user-login-portal.firebasestorage.app",
  messagingSenderId: "183527442150",
  appId: "1:183527442150:web:15341cf06a216c10ab9d27",
  measurementId: "G-NG9H5NJEPH"
};

function generateMemberNo(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

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
  const birthday = document.getElementById("birthday").value;

  try {
    // ① 認証ユーザー作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ② 会員番号を自動生成（重複チェック付き）
    const memberNo = await generateUniqueMemberNo(db);

    // ③ Firestoreに保存
    await setDoc(doc(db, "users", user.uid), {
      name,
      birthday,
      email,
      memberNo,
      role: "user",
      createdAt: serverTimestamp()
    });

    message.textContent = `登録完了！あなたの会員番号は「${memberNo}」です`;
    message.style.color = "green";

    // location.href = "./index.html";
  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
});