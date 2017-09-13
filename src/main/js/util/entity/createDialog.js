'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import ReactModal from "react-modal";
import Selector from "../select";

export default class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getOptionsFromArray = this.getOptionsFromArray.bind(this);
        this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({showModal: true});
    }

    handleCloseModal() {
        this.setState({showModal: false});
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
                <input type="text" placeholder={attribute} ref={attribute} className="field"/>
            </div>);
        });

        return (
            <div>
                <a href="#createDialog" className="material-icons" title="Add new" onClick={this.handleOpenModal}>person_add</a>

                <ReactModal isOpen={this.state.showModal}
                            onRequestClose={this.handleCloseModal}
                            contentLabel="Create">
                    <div>
                        <button onClick={this.handleCloseModal} title="Close" className="close">X</button>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </ReactModal>
            </div>
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

        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    getOptionsFromArray(arr) {
        return arr.map(value => {
            return {
                value: value,
                label: this.capitalizeFirstLetter(value)
            }
        })
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

}