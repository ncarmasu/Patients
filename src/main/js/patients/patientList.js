'use strict';
const React = require('react');
import Patient from "./patientListItem";
import AbstractList from "../abstract/abstractList";

export default class PatientList extends AbstractList {

    constructor(props) {
        super(props);
        this.getTableBody = this.getTableBody.bind(this);
        this.getTableHead = this.getTableHead.bind(this);
        this.executeSearch = this.executeSearch.bind(this);

    }

    getTableBody() {
        var patients = this.props.patients.map(patient =>
            <Patient key={patient.entity._links.self.href} patient={patient}
                     attributes={this.props.attributes}
                     schemaProperties={this.props.schemaProperties}
                     onUpdate={this.props.onUpdate}
                     onDelete={this.props.onDelete}/>
        );
        return patients;
    }

    getTableHead() {
        return (
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th></th>
            </tr>
        );
    }

    executeSearch(searchInput) {
        this.props.searchPatient(searchInput);
    }
}