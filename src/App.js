import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo : ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  let handleSignIn = () => { 
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
        // console.log(signedInUser);
      })
      .catch(err => {
        // console.log(err);
        // console.log(err.message);
    })
  };
  let handleSignOut = () => { 
    firebase.auth().signOut()
      .then(res => { 
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error : '',
          isValid: false,
          existingUser : false
        }
        setUser(signedOutUser);
      })
      .catch(err => { 
        // console.log(err.message);
      });
  };
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber = input => /\d/.test(input);
  const switchForm = e => { 
          const createdUser = { ...user };
          createdUser.existingUser = e.target.checked;
          setUser(createdUser);
          // console.log(e.target.checked);
  };
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 6 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    // console.log(newUserInfo);
    // console.log(e.target.name,e.target.value);
  };
  const createAccount = (e) => { 
    if (user.isValid) {
      // console.log(user.email);
      // console.log(user.password);
      // console.log('Valid Form');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          // console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    } else {
      // console.log('Invalid Form');
    }
    e.preventDefault();
    e.target.reset();
  };
  const signInUser = e => { 
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          // console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div className="App container">
      {
        user.isSignedIn ? <button onClick = {handleSignOut} className = "btn btn-lg btn-primary mt-1">Sign Out</button> : <button onClick = {handleSignIn} className = "btn btn-lg btn-success mt-1">Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <h3>Welcome, {user.name}</h3>
          <h4>{user.email}</h4>
          <img src={user.photo} alt="" />
          <h1>Firebase Authentication</h1>
        </div>
      }
      <div className="form-check">
        <input type="checkbox" name="switchForm" onChange={switchForm} className="form-check-input" id="exampleCheck1"/>
        <label className="form-check-label" htmlFor="exampleCheck1">Returning User</label>
      </div>
      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="email" onBlur={handleChange} name="email" className="form-control mt-1 mb-1"  placeholder="Enter email" required />
        <input type="password" onBlur={handleChange} name="password" className="form-control mb-1"  placeholder="Password" required />
        <input type="submit" value="Sign In"/>
      </form>
      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" className="form-control mt-1 mb-1" placeholder="Your Name" required />
        <input type="email" onBlur={handleChange} name="email" className="form-control mt-1 mb-1" id="InputEmail" placeholder="Enter email" required />
        <input type="password" onBlur={handleChange} name="password" className="form-control mb-1" id="InputPass" placeholder="Password" required />
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p className="text-danger">{user.error}</p>
      }
    </div>
  );
}

export default App;
