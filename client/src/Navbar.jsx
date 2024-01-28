import React from "react";

const Navbar = () => {
  return (
    <>
        <nav style={{background:"transparent"}}>
          <div className="navbar">
            <div>Logo</div>
            <div className="navlinks">
              <ul>
                <li>link1</li>
                <li>link2</li>
                <li>link3</li>
              </ul>
            </div>
            <div></div>
          </div>
        </nav>
    </>
  );
};

export default Navbar;
