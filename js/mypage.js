import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   GitHub Pages 用ベースパス
================================ */
const BASE_PATH = "/membership-portal/";

/* ===============================
   Firebase 初期化
================================ */
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

/* ===============================
   DOM取得（安全）
================================ */
const nameEl = document.getElementById("name");
const memberNoEl = document.getElementById("memberNo");
const birthdayEl = document.getElementById("birthday");
const emailEl = document.getElementById("email");
const profile = document.getElementById("profile");
const logoutBtn = document.getElementById("logoutBtn");

/* ===============================
   ログアウト処理
================================ */
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    sessionStorage.clear();
 location.href = BASE_PATH;
  });
}

/* ===============================
   認証チェック（ここだけで制御）
================================ */
onAuthStateChanged(auth, async (user) => {

  // 未ログインなら即 index へ
  if (!user) {
    location.href = BASE_PATH;
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      console.error("ユーザーデータなし");
      return;
    }

    const data = snap.data();

    if (nameEl) nameEl.value = data.name ?? "";
    if (memberNoEl) memberNoEl.value = data.memberNo ?? "";
    if (birthdayEl) birthdayEl.value = data.birthday ?? "";
    if (emailEl) emailEl.value = data.email ?? user.email ?? "";

    if (profile) profile.style.display = "block";

    // session保存
    sessionStorage.setItem("chatName", data.name ?? "");
    sessionStorage.setItem("chatEmail", data.email ?? user.email ?? "");
    sessionStorage.setItem("memberNo", data.memberNo ?? "");
    sessionStorage.setItem("birthday", data.birthday ?? "");

  } catch (error) {
    console.error(error);
  }
});