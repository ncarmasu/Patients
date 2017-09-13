'use strict';
const React = require('react');

import Visit from "./visitListItem";
import AbstractList from "../abstract/abstractList";

export default class VisitList extends AbstractList {

    constructor(props) {
        super(props);
        this.getTableBody = this.getTableBody.bind(this);
        this.getTableHead = this.getTableHead.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
    }

    getTableBody() {
        var visits = this.props.visits.map(visit =>
            <Visit key={visit.entity._links.self.href} visit={visit}
                   schemaProperties={this.props.schemaProperties}
                   onDelete={this.props.onDelete}/>
        );
        return visits;
    }

    getTableHead() {
        return (
            <tr>
                <th>Type</th>
                <th>Observations</th>
                <th>Date</th>
                <th></th>
            </tr>
        );
    }

    executeSearch(searchInput) {
        this.props.searchVisits(searchInput);
    }
}