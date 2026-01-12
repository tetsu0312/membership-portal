import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase設定
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
const db = getFirestore(app);

// 6桁英数字の会員番号生成
function generateMemberNo(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// 会員番号の重複チェック付き生成
async function generateUniqueMemberNo() {
  while (true) {
    const memberNo = generateMemberNo();

    const q = query(
      collection(db, "users"),
      where("memberNo", "==", memberNo)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      return memberNo;
    }
  }
}

// DOM
const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const birthday = document.getElementById("birthday").value;

  try {
    // ① Firebase Authentication にユーザー作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ② 会員番号を生成（重複なし）
    const memberNo = await generateUniqueMemberNo();

    // ③ Firestore にユーザー情報を保存
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      birthday,
      memberNo,
      role: "user",
      createdAt: serverTimestamp()
    });

    // ④ 登録完了 → マイページへ
    location.replace("./mypage.html");

  } catch (error) {
    message.textContent = error.message;
    message.style.color = "red";
  }
});