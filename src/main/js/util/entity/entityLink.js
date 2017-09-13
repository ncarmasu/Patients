'use strict';

const React = require('react');
import {Route, Link} from "react-router-dom";

//TODO Also defined in Home.js define it in a single place
var root = '/api';

export default class EntityLink extends React.Component {

    constructor(props) {
        super(props);
        this.extractPathForEntity = this.extractPathForEntity.bind(this);
    }

    render() {
        return (
            <Link to={{
                pathname: this.extractPathForEntity(this.props.entity),
                state: {entity: this.props.entity}
            }}>
                {this.props.displayValue}
            </Link>
        );
    }

    extractPathForEntity(entity) {
        var href = entity._links.self.href;
        return href.substring(href.lastIndexOf(root) + root.length);
    }
}