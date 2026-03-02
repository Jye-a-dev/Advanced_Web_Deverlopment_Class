/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";
 
import { Link } from "react-router-dom";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            <Link to="/product/">
              <img
                src={"data:image/jpg;base64," + item.image}
                width="300px"
                height="300px"
                alt=""
              />
            </Link>
            <figcaption className="text-center">
              {item.name}
              <br />
              Price: {item.price}
            </figcaption>
          </figure>
        </div>
      );
    });

    return <div className="align-center">{prods}</div>;
  }

  componentDidMount() {
    const params = this.props.params;

    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;

    if (
      params.cid &&
      params.cid !== prevProps.params.cid
    ) {
      this.apiGetProductsByCatID(params.cid);
    } else if (
      params.keyword &&
      params.keyword !== prevProps.params.keyword
    ) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios
      .get("/api/customer/products/category/" + cid)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result });
      });
  }

  apiGetProductsByKeyword(keyword) {
    axios
      .get("/api/customer/products/search/" + keyword)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result });
      });
  }
}

export default withRouter(Product);