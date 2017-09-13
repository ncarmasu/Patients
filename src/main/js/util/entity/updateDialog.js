'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

export default class UpdateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        var inputs = this.props.attributes.map(attribute =>
            <p key={this.props.entity['id'] + '_' + attribute}>
                <input type="text"
                       placeholder={attribute}
                       defaultValue={this.props.entity[attribute]}
                       ref={attribute} className="field"/>
            </p>
        );

        var dialogId = "update-" + this.props.entity._links.self.href;

        return (

            <span className="editIcon">
                <a href={"#" + dialogId} title="Update"><i className="material-icons">mode_edit</i></a>

                <div id={dialogId} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>
                        <h2>Update</h2>
                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Update</button>
                        </form>
                    </div>
                </div>
            </span>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        var updatedEntity = {};
        this.props.attributes.forEach(attribute => {
            updatedEntity[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onUpdate(this.props.entity, updatedEntity);
        window.location = "#";
    }
}