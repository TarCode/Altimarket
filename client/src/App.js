
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './pages/main';
import Nav from './components/nav'
import Landing from './pages/landing'
import "./App.css";

function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="/main" exact component={Main} />
        <Route path="/" exact component={Landing} />
      </div>
    </Router>
  );
}

export default AppRouter;
