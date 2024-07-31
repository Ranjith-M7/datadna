import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "./Auth.css";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = () => {
    if (!emailOrPhone || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    setErrorMessage("");
    if (emailOrPhone.includes("@")) {
      signInEmailPassword(emailOrPhone, password);
    } else {
      signInWithPhone(emailOrPhone, password);
    }
  };

  const signInEmailPassword = (emailOrPhone, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailOrPhone, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setMessage(`Signed in as ${user.email}`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    provider.setCustomParameters({
      login_hint: "user@example.com",
      prompt: "select_account",
    });

    firebase.auth().useDeviceLanguage();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        setMessage(`Signed in with Google as ${user.displayName}`);
        const email = user.email;
        const displayName = user.displayName.split(" ");
        storeUserData(user.uid, displayName[0], displayName[1], email);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const signInWithMicrosoft = () => {
    const provider = new firebase.auth.OAuthProvider("microsoft.com");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        setMessage(`Signed in with Microsoft as ${user.displayName}`);
        const email = user.email;
        const displayName = user.displayName.split(" ");
        storeUserData(user.uid, displayName[0], displayName[1], email);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const signInWithPhone = (emailOrPhone, password) => {
    const phoneNumber = `+91${emailOrPhone}`;
    const appVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        const verificationCode = window.prompt("Enter verification code");
        confirmationResult
          .confirm(verificationCode)
          .then((result) => {
            const user = result.user;
            setMessage(`Signed in with phone number as ${user.phoneNumber}`);
            const email = user.email || "default@example.com";
            storeUserData(user.uid, "", "", email, user.phoneNumber);
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          })
          .catch((error) => {
            setMessage(`Error: ${error.message}`);
          });
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const signUp = () => {
    if (!firstName || !lastName || !emailOrPhone || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    setErrorMessage("");
    firebase
      .auth()
      .createUserWithEmailAndPassword(emailOrPhone, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setMessage(`Signed up as ${user.email}`);
        storeUserData(user.uid, firstName, lastName, emailOrPhone);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const storeUserData = (uid, firstName, lastName, email, phoneNumber = "") => {
    firebase
      .database()
      .ref("users/" + uid)
      .set({
        firstName,
        lastName,
        email,
        phoneNumber,
      });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="auth">
      <div className={`custom-container ${isSignUp ? "active" : ""}`}>
        <div className="custom-form-container custom-sign-up">
          <form>
            <h2 className="fw-bold">Create Account</h2>
            <div className="custom-social-icons">
              <a href="#" onClick={signInWithGoogle}>
                <FaGoogle />
              </a>
              <a href="#" onClick={signInWithMicrosoft}>
                <FaMicrosoft />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={signUp}>
              Sign Up
            </button>
            <div id="recaptcha-container"></div>
            {errorMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
            )}
          </form>
        </div>
        <div className="custom-form-container custom-sign-in">
          <form>
            <h2 className="fw-bold">Sign In</h2>
            <div className="custom-social-icons">
              <a href="#" onClick={signInWithGoogle}>
                <FaGoogle />
              </a>
              <a href="#" onClick={signInWithMicrosoft}>
                <FaMicrosoft />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="text"
              placeholder="Email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="button" onClick={signIn}>
              Sign In
            </button>
            <div id="recaptcha-container"></div>
            {errorMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
            )}
            {message && (
              <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
            )}
          </form>
        </div>
        <div className="custom-toggle-container">
          <div className="custom-toggle">
            <div
              className={`custom-toggle-panel custom-toggle-left ${
                isSignUp ? "custom-toggle-hidden" : ""
              }`}
            >
              <h1 className="fw-bold text-white">Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="hidden" onClick={toggleForm}>
                Sign In
              </button>
            </div>
            <div
              className={`custom-toggle-panel custom-toggle-right ${
                isSignUp ? "" : "custom-toggle-hidden"
              }`}
            >
              <h1 className="fw-bold text-white">Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="hidden" onClick={toggleForm}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
