import React from "react";
import "../css/main.css";

const Header = () => {
  return (
    <>
      <div id="headerwrap">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="centered outline">CryptoDoggies</h1>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Header;
