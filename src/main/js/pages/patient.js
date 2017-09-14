'use strict';

const React = require('react');
const when = require('when');

const ws = require('../util/ws-listenter');
const client = require('../util/client');
const follow = require('../util/follow'); // function to hop multiple links by "rel"

import VisitList from "../visits/visitList";
import EntityDialog from "../util/entity/entityDialog";


var root = '/api';

export default class visit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visits: [], attributes: [], links: {}, totalElements: 0, searchInput: '', schema: {}};

        this.loadFromServer = this.loadFromServer.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {

        this.loadFromServer(true);
        ws.register([
            {route: '/topic/deleteVisit', callback: this.loadFromServer}
        ]);

    }

    render() {
        return (
            <div>
                <EntityDialog attributes={this.state.attributes}
                              schemaProperties={this.state.schema.properties}
                              onCreate={this.onCreate}/>
                <VisitList visits={this.state.visits}
                           totalElements={this.state.totalElements}
                           links={this.state.links}
                           attributes={this.state.attributes}
                           searchInput={this.state.searchInput}
                           onDelete={this.onDelete}
                           onUpdate={this.onUpdate}
                           searchVisits={this.searchVisits}
                           schemaProperties={this.state.schema.properties}
                />
            </div>
        )
    }

    loadFromServer(reloadSchema, searchInput) {


        if (reloadSchema) {
            follow(client, root, ['visits']).then(visits => {
                client({
                    method: 'GET',
                    path: visits.entity._links.profile.href,
                    headers: {'Accept': 'application/schema+json'}
                }).done(schema => {
                    if (schema.entity) {
                        delete schema.entity.properties.date;
                        this.schema = schema.entity;
                    }
                    // this.links = visits.entity._links;
                });
            });
        }

        var currentLocation = this.props.location.pathname;
        var path = root + currentLocation;
        follow(client, path, ['visits']).then(visits => {
            console.log("LOG 2 " + visits);
            return visits.entity._embedded.visits.map(visit =>
                client({
                    method: 'GET',
                    path: visit._links.self.href
                })
            );
        }).then(visitsPromises => {
            return when.all(visitsPromises);
        }).done(visits => {
            this.setState({
                visits: visits,
                totalElements: visits.length,
                searchInput: searchInput,
                attributes: (this.schema) ? Object.keys(this.schema.properties) : [],
                links: this.links,
                schema: this.schema
            });
        });
    }

    searchVisits(searchInput) {

    }

    onDelete(visit) {
        client({method: 'DELETE', path: visit.entity._links.self.href});
    }
}