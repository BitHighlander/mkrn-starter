
import QRCode from 'react-qr';
import Websocket from 'react-websocket';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { getAuthenticatedUser } from '../../redux/modules/user';
import { logoutUser } from '../../redux/modules/authentication';


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showComponent: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }

  handleData(data) {
    const result = JSON.parse(data);
    console.log(result);
    // this.setState({ count: this.state.count + result.movement });
    this.time = result.time;
    this.forceUpdate();
  }

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
            () => (
              <div className="auth-box">

                <div>Welcome to the dashboard your keyID: {testObj}
                  <div>Bitcoin: {bitcoin}</div>
                  <button onClick={this.onButtonClick} className="btn btn-info btn-lg"><span className="glyphicon glyphicon-bitcoin" /> Bitcoin</button>
                  {this.state.showComponent ?
                    <QRCode text={bitcoin} /> :
                    null
                  }
                </div>
                <Websocket
                  url="ws://localhost:4101"
                  onMessage={this.handleData.bind(this)}
                />
                <div>time: {this.time}</div>
              </div>
            )
          }
        />
      </Switch>
    );
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
