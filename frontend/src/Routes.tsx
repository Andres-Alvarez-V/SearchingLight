import React, {useState, useEffect} from 'react';
import {Route} from "react-router-dom";

import Home from './components/Home'
import Play from './components/Play';
import Login from './components/Login';
import Register from './components/Register';

interface Profile {
  logged : Boolean;
}

interface State {
  user : Object;
  profile: Profile;
}

export default function Routes(){
    const [state, setState] = useState<State>({
      user: {},
      profile : {
        logged: false,
      }
    });

    useEffect(()=> {
      console.log("estado madre", state);
    }, [state])

    return(
        <>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/play">
          <Play Pattern = {{state, setState}}/>
        </Route>
        <Route exact path="/login">
          <Login Pattern={{state, setState}}/>
        </Route>
        <Route exact path="/register">
          <Register/>
        </Route>
        </>
    )
}