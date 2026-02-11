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
const message = document.getElementById("message") || null;

// ログアウト
document.getElementById("logoutBtn").addEventListener("click", async () => {
  sessionStorage.clear();
  await signOut(auth);
  location.replace("./index.html");
});

onAuthStateChanged(auth, async (user) => {

  // 未ログインなら index へ
  if (!user) {
    location.replace("./index.html");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      if (message) message.textContent = "ユーザー情報が見つからんかったよ😱";
      return;
    }

    const data = snap.data();

    // input なので value を使う
    nameEl.value = data.name ?? "";
    memberNoEl.value = data.memberNo ?? "";
    birthdayEl.value = data.birthday ?? "";
    emailEl.value = data.email ?? user.email ?? "";

    profile.style.display = "block";

    // sessionStorage 保存
    sessionStorage.setItem("chatName", data.name ?? "");
    sessionStorage.setItem("chatEmail", data.email ?? user.email ?? "");
    sessionStorage.setItem("memberNo", data.memberNo ?? "");
    sessionStorage.setItem("birthday", data.birthday ?? "");

  } catch (e) {
    if (message) message.textContent = e.message;
  }
});