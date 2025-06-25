import React from "react";
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = ({ user, signIn }) => {
  
  return (
    <nav className="navbar">
      <div className="left">
        <img src={logo} alt="logo" className="logo" />
        <span className="name plnt">Planet
          <span className="name fix">Fix</span>
        </span>
      </div>

    <div className="right">
        {/* <ul>
          <li><a href="#past" className="past">Past<span className="emoji earth">🌍</span></a></li>
          <li><a href="#present" className="present">Present<span className="emoji leaf">🌿</span></a></li>
          <li><a href="#future" className="future">Future<span className="emoji leaf2">🌱</span></a></li>
        </ul>  */}

          {!user ? (
            <button onClick={signIn} className="sign-in">Sign in with Google</button>
          ) : (
            <p className="welcome">👋 {user.displayName}</p>
          )}
        </div>

    </nav>
  );
};

export default Navbar;