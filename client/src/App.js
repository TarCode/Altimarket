
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './pages/main';
import Nav from './components/nav'
import "./App.css";

function AppRouter() {
  return (
    <Router>
      <div style={{
        paddingTop: '80px'
      }}>
        <Route path="*" exact component={Nav} />
        <Route path="/" exact component={Main} />
      </div>
    </Router>
  );
}

export default AppRouter;
