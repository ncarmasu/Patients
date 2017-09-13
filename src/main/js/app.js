'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from "./pages/home";
import Patient from "./pages/patient";

ReactDOM.render(
    <Router history="">
        <div>
            <Route exact="true" path="/" component={Home}/>
            <Route path="/patients/:id" component={Patient}/>
        </div>
    </Router>,
    document.getElementById('react')
);
