import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// DOM
const nameEl = document.getElementById("name");
const memberNoEl = document.getElementById("memberNo");
const birthdayEl = document.getElementById("birthday");
const emailEl = document.getElementById("email");
const profile = document.getElementById("profile");
const message = document.getElementById("message");

// ログアウト
document.getElementById("logoutBtn").addEventListener("click", async () => {
  sessionStorage.clear();
  await signOut(auth);
  location.replace("./index.html");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("./index.html");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) {
      message.textContent = "ユーザー情報が見つからんかったよ😱";
      return;
    }

    const data = snap.data();

    // ① 画面に表示
    nameEl.textContent = data.name ?? "";
    memberNoEl.textContent = data.memberNo ?? "";
    birthdayEl.textContent = data.birthday ?? "";
    emailEl.textContent = data.email ?? user.email ?? "";
    profile.style.display = "block";

    // ② window に直置き（ChatPlus用）
  window.__CHATPLUS_USER__ = {
  chatName: data.name ?? "",
  chatEmail: data.email ?? user.email ?? "",
  memberNo: data.memberNo ?? "",
  birthday: data.birthday ?? ""
};

  } catch (e) {
    message.textContent = e.message;
  }
});