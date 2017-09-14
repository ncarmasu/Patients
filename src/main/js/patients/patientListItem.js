'use strict';

const React = require('react');

import EntityDialog from "../util/entity/entityDialog";
import EntityLink from "../util/entity/entityLink";

export default class Patient extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.patient);
    }

    render() {
        return (
            <tr>
                <td>
                    <EntityLink entity={this.props.patient.entity}
                                displayValue={this.props.patient.entity.firstName + ' ' + this.props.patient.entity.lastName}/>
                    <span className="editIcon"> <EntityDialog
                        entity={this.props.patient.entity}
                        attributes={this.props.attributes}
                        onUpdate={this.props.onUpdate}
                        schemaProperties={this.props.schemaProperties}/></span>
                </td>
                <td>{this.props.patient.entity.description}</td>
                <td>
                    <i onClick={this.handleDelete} className="material-icons">delete</i>
                </td>
            </tr>
        )
    }
}