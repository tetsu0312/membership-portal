import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

const message = document.getElementById("message");
const profile = document.getElementById("profile");

const nameEl = document.getElementById("name");
const memberNoEl = document.getElementById("memberNo");
const birthdayEl = document.getElementById("birthday");
const emailEl = document.getElementById("email");

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  location.replace("./index.html");
});

onAuthStateChanged(auth, async (user) => {
  // 🔐 未ログインなら即ログインページ
  if (!user) {
    location.replace("./index.html");
    return;
  }

  // ✅ ログイン済みユーザーだけここに来る
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      message.textContent = "ユーザー情報が見つからんかったよ😱";
      return;
    }

    const data = snap.data();
    nameEl.textContent = data.name ?? "";
    memberNoEl.textContent = data.memberNo ?? "";
    birthdayEl.textContent = data.birthday ?? "";
    emailEl.textContent = data.email ?? user.email ?? "";

    profile.style.display = "block";
    message.textContent = "";

        document.__cp_p = {
      chatName: nameEl.textContent,
      chatEmail: emailEl.textContent,
    };

    document.__cp_f = {
      "会員番号": memberNoEl.textContent,
      "誕生日": birthdayEl.textContent,
    };
    
  } catch (e) {
    message.textContent = e.message;
  }

  
});