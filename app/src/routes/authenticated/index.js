
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { getAuthenticatedUser } from '../../redux/modules/user';
import { logoutUser } from '../../redux/modules/authentication';
import QRCode from 'react-qr';

class Dashboard extends Component {
  render() {
    console.log('this22: ', this);
    // console.log('this22: ', this.props.get);
    // let authentication = this.
    const { user } = this.props;
    // const { user } = this.props;
    console.log('user22: ', user);

    let testObj = 'Loading....';
    if (user && user.firstName) {
      testObj = user.yubiID;
    }

    let bitcoin = 'Loading....';
    if (user && user.bitcoin) {
      bitcoin = user.bitcoin;
    }


    // console.log('user223: ', user.firstName);
    // console.log(this.state.gifs);
    return (
      <Switch>
        <Route
          exact
          path="/dashboard"
          component={
            () => (<div>Welcome to the dashboard your keyID: {testObj}
              <div>Bitcoin: {bitcoin}</div><QRCode text={bitcoin} /></div>)
          }
        />
      </Switch>
    );


    // return (
    //   <div className="auth-box">
    //     <h1>Buy Funbucks bro!
    //       <br />
    //
    //       {/* <button onClick={this.onSubmit} className="btn btn-info btn-lg"> */}
    //       {/* <span className="glyphicon glyphicon-bitcoin" /> Bitcoin */}
    //       {/* </button> */}
    //
    //       <div>
    //         <button onClick={this.onButtonClick} className="btn btn-info btn-lg"><span className="glyphicon glyphicon-bitcoin" /> Bitcoin</button>
    //         {this.state.showComponent ?
    //           <QRCode text={this.address} /> :
    //           null
    //         }
    //       </div>
    //
    //       {/* <QRCode value="hey" /> */}
    //
    //       {/* <ul className="form-list"> */}
    //       {/* <li> */}
    //       {/* <label htmlFor="card-element"> */}
    //       {/* {this.props.label} */}
    //       {/* </label> */}
    //       {/* <div id="card-element" /> */}
    //       {/* </li> */}
    //       {/* </ul> */}
    //       <div id="card-errors" role="alert" />
    //
    //     </h1>
    //   </div>
    // );
  }
}


Dashboard.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
  }),
  yubikey: PropTypes.shape({
    yubikey: PropTypes.string,
  }),
  bitcoin: PropTypes.shape({
    bitcoin: PropTypes.string,
  }),
  authenticated: PropTypes.bool,
  logoutUser: PropTypes.func,
};

const mapStateToProps = ({ user, authentication }) => ({
  user: getAuthenticatedUser({ user, authentication }),
  authenticated: authentication.authenticated,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);


// import React from 'react';
// import { Route, Switch } from 'react-router-dom';
// // import { Link } from 'react-router';
//
// // import { protectedTest } from '../../actions/auth';
//
//
// const AuthenticatedRoutes = () => (
//   <Switch>
//     <Route exact path="/dashboard" component={() => <div>Welcome to the dashboard faggot</div>} />
//   </Switch>
// );
//
// // old
// export default AuthenticatedRoutes;


// import React from 'react';
// import { Route, Switch } from 'react-router-dom';
// import Billing from '../../components/billing/bitcoin';
//
//
// const AuthenticatedRoutes = () => (
//   <Switch>
//     <Route exact path="/dashboard" component={Billing} />
//     <Route exact path="/bitcoin" component={Billing} />
//   </Switch>
// );
//
// export default AuthenticatedRoutes;
