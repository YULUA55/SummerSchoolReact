import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import response from "../users.json";
import { GET_USER_REQUEST } from '../constants/api';
import { add, del } from '../actions/userActions';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await Axios.get(GET_USER_REQUEST, {
  //         headers: { Authorization: Cookies.get('token') }
  //       });
  //       console.log(response);
  //       if (response.data.code !== 200) {
  //         throw Error(response.data.message);
  //       }
  //       setUser(response.data.message);
  //       dispatch(add(response.data.message));
  //     } catch (error) {
  //       setIsError(true);
  //       setUser();
  //       dispatch(del());
  //       Cookies.remove('token');
  //     }
  //     setIsLoading(false);
  //   };
  //   fetchUser();
  // }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(response);
        var sign = false;
        response.forEach(element => {
          let token = (element.data.message.token).trim();
          if (token === Cookies.get('token')) {
            console.log("I'm here")
            sign = true;
            setUser(element.data.message);
            console.log(element.data.message);
            dispatch(add(element.data.message));
          }
        });

        if (!sign) {
          throw Error(response.data.message);
        }

      } catch (error) {
        setIsError(true);
        setUser();
        dispatch(del());
        Cookies.remove('token');
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isError) return <Redirect to="/" />;

  if (isLoading) return (<div>Loading...</div>);
  return (
    <Route
      {...rest}
      render={props => (user !== null ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

PrivateRoute.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  component: PropTypes.any.isRequired
};

export default PrivateRoute;
