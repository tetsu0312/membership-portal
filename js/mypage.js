import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
   DOM取得
================================ */
const nameEl = document.getElementById("name");
const memberNoEl = document.getElementById("memberNo");
const birthdayEl = document.getElementById("birthday");
const emailEl = document.getElementById("email");
const profile = document.getElementById("profile");

/* ===============================
   ログアウト（飛ばさない）
================================ */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    sessionStorage.clear();
    alert("ログアウトしました。\nログインページはこちら → index.html");
  });
}

/* ===============================
   認証チェック（飛ばさない）
================================ */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    document.body.innerHTML = `
      <div style="padding:40px; font-family:sans-serif;">
        <h2>ログインしていません</h2>
        <p>ログインページはこちら：</p>
        <a href="index.html">index.html</a>
      </div>
    `;
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      alert("ユーザーデータがありません");
      return;
    }

    const data = snap.data();

    if (nameEl) nameEl.value = data.name ?? "";
    if (memberNoEl) memberNoEl.value = data.memberNo ?? "";
    if (birthdayEl) birthdayEl.value = data.birthday ?? "";
    if (emailEl) emailEl.value = data.email ?? user.email ?? "";

    if (profile) profile.style.display = "block";

  } catch (error) {
    console.error(error);
  }
});