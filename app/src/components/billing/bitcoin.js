/**
 * Created by highlander on 10/3/17.
 */
import React, { Component } from 'react';

import QRCode from 'react-qr';
import PropTypes from 'prop-types';
// import bitcoin from '../../components/billing/bitcoin';
import Websocket from 'react-websocket';
import { connect } from 'react-redux';
import { getAuthenticatedUser } from '../../redux/modules/user';
import { logoutUser } from '../../redux/modules/authentication';

// var QRCode = require('react-qr')


class CreditCardFields extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showComponent: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

    componentDidMount = () => {
      const { user } = this.props;
      console.log('user BRO: ', user);
      // Mount Stripe elements
      this.address = user.bitcoin;
    };


    onButtonClick() {
      this.setState({
        showComponent: true,
      });
    }

    handleData(data) {
      const result = JSON.parse(data);
      console.log(result);
      this.setState({ count: this.state.count + result.movement });
    }

    render() {
      return (
        <div className="auth-box">
          <h1>Buy Funbucks bro!
            <br />

            {/* <button onClick={this.onSubmit} className="btn btn-info btn-lg"> */}
            {/* <span className="glyphicon glyphicon-bitcoin" /> Bitcoin */}
            {/* </button> */}
            <Websocket
              url="ws://localhost:4101"
              onMessage={this.handleData.bind(this)}
            />

            <div>
              <button onClick={this.onButtonClick} className="btn btn-info btn-lg"><span className="glyphicon glyphicon-bitcoin" /> Bitcoin</button>
              {this.state.showComponent ?
                <QRCode text={this.address} /> :
                null
              }
            </div>

            {/* <QRCode value="hey" /> */}

            {/* <ul className="form-list"> */}
            {/* <li> */}
            {/* <label htmlFor="card-element"> */}
            {/* {this.props.label} */}
            {/* </label> */}
            {/* <div id="card-element" /> */}
            {/* </li> */}
            {/* </ul> */}
            <div id="card-errors" role="alert" />

          </h1>
        </div>
      );
    }
}

CreditCardFields.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    bitcoin: PropTypes.string,
  }),
  authenticated: PropTypes.bool,
  logoutUser: PropTypes.func,
};

const mapStateToProps = ({ user, authentication }) => ({
  user: getAuthenticatedUser({ user, authentication }),
  authenticated: authentication.authenticated,
});

export default connect(mapStateToProps, { logoutUser })(CreditCardFields);
