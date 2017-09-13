'use strict';

import React from "react";
import Select from "react-select";

export default class Selector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: this.props.options[0]};
    }

    updateState(element) {
        this.setState({value: element});
    }

    render() {
        return (
            <Select
                name={this.props.name}
                value={this.state.value}
                options={this.props.options}
                className={this.props.className}
                onChange={this.updateState.bind(this)}
            />
        );
    }
}
