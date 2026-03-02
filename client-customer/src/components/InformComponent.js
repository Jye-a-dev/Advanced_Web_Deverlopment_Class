/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";
class Inform extends Component {
  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          <Link to="">Login</Link> | <a href="">Sign-up</a> |{" "}
          <Link to="">Active</Link> tranghongson@gmail.com
        </div>

        <div className="float-right">
          <Link to="">My cart</Link> have <b>0</b> items
        </div>

        <div className="float-clear" />
      </div>
    );
  }
}

export default Inform;