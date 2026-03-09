/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";

class Inform extends Component {
	static contextType = MyContext;

	render() {
		return (
			<div className="float-left">
				{this.context.token === "" ? (
					<div>
						<Link to="/login">Login</Link> | <Link to="/signup">Sign-up</Link> | <Link to="/active">Active</Link>
					</div>
				) : (
					<div>
						Hello <b>{this.context.customer.name}</b> |{" "}
						<Link to="/home" onClick={() => this.lnkLogoutClick()}>
							Logout
						</Link>{" "}
						| <Link to="/myprofile">My profile</Link> | <Link to="">My orders</Link>
					</div>
				)}
			</div>
		);
	}

	lnkLogoutClick() {
		this.context.setToken("");
		this.context.setCustomer(null);
	}
}

export default Inform;