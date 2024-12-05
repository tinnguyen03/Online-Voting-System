import React from "react";
import "./FooterComponent.css";

const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Voting Website. All rights reserved.
        </p>
        <ul className="footer-links">
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default FooterComponent;
