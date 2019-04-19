
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from './pages/main';
import "./App.css";

function AppRouter() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Main} />
      </div>
    </Router>
  );
}

export default AppRouter;
