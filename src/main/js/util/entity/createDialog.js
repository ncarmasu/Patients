'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import Modal from "../modal";
import Selector from "../select";

export default class CreateDialog extends React.Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getOptionsFromArray = this.getOptionsFromArray.bind(this);
        CreateDialog.capitalizeFirstLetter = CreateDialog.capitalizeFirstLetter.bind(this);
    }

    render() {
        var inputs = this.props.attributes.map(attribute => {

            var label = <div><label>{this.props.schemaProperties[attribute].title}</label></div>;

            if (this.props.schemaProperties && this.props.schemaProperties[attribute].enum) {

                var options = this.getOptionsFromArray(this.props.schemaProperties[attribute].enum);
                return (
                    <div>
                        {label}
                        < Selector key={attribute}
                                   name={this.props.schemaProperties[attribute].title}
                                   options={options}
                                   className="modalInputField"
                        />
                    </div>
                );
            }

            return (<div key={attribute}>
                {label}
                <input type="text" ref={attribute} className="field"/>
            </div>);
        });

        var content = <form>
            {inputs}
            <button onClick={this.handleSubmit}>Create</button>
        </form>;
        return (
            <Modal ref={(modal) => {
                this.modal = modal;
            }}
                   content={content}
                   materialIconName="person_add"
                   buttonTitle="Add new"/>
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        var newEntity = {};
        this.props.attributes.forEach(attribute => {
            newEntity[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newEntity);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });
        this.modal.handleCloseModal();
    }

    getOptionsFromArray(arr) {
        return arr.map(value => {
            return {
                value: value,
                label: CreateDialog.capitalizeFirstLetter(value)
            }
        })
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

}