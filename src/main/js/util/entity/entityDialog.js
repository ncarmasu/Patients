'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import Modal from "../modal";
import Selector from "../select";
import Str from "../str";

/**
 * Modal dialog used to create or update a new entity. It contains the launch button and the actual dialog.
 * Based on whether the entity property exists it renders itself in create or update mode.
 */
export default class EntityDialog extends React.Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getOptionsFromArray = this.getOptionsFromArray.bind(this);
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
                                   defaultValue={this.props.entity ? this.props.entity[attribute] : ""}
                                   className="modalInputField"
                        />
                    </div>
                );
            }

            return (<div>
                {label}
                <input key={attribute} type="text" ref={attribute} className="field"
                       defaultValue={this.props.entity ? this.props.entity[attribute] : ""}/>
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
                   materialIconName={this.props.entity ? "mode_edit" : "person_add"}
                   buttonTitle={this.props.entity ? "Update" : "Add"}/>
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        var newEntity = {};
        this.props.attributes.forEach(attribute => {
            newEntity[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        if (this.props.entity) {
            this.props.onUpdate(this.props.entity, newEntity);
        }
        else {
            this.props.onCreate(newEntity);
        }
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
                label: Str.capitalizeFirstLetter(value)
            }
        })
    }
}