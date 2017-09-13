'use strict';

const React = require('react');


export default class VisitListItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.visit);
    }

    render() {

        return (
            <tr>
                <td>{this.props.visit.entity.type}</td>
                <td>{this.props.visit.entity.observations}</td>
                <td>{this.props.visit.entity.date}</td>
                <td>
                    <i onClick={this.handleDelete} className="material-icons">delete</i>
                </td>
            </tr>
        )
    }

}
