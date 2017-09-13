'use strict';

const React = require('react');
const when = require('when');

const ws = require('../util/ws-listenter');
const client = require('../util/client');
const follow = require('../util/follow'); // function to hop multiple links by "rel"


import PatientList from "../patients/patientList";
import CreateDialog from "../util/entity/createDialog";

var root = '/api';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            attributes: [],
            pageSize: 2,
            page: 1,
            links: {},
            totalElements: 0,
            searchInput: '',
            schema: {}
        };
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
        this.searchPatient = this.searchPatient.bind(this);
    }

    componentDidMount() {
        this.reloadPatients(this.state.pageSize);
        ws.register([
            // {route: '/topic/newPatient', callback: this.refreshAndGoToLastPage},
            {route: '/topic/updatePatient', callback: this.refreshCurrentPage},
            {route: '/topic/deletePatient', callback: this.refreshCurrentPage}
        ]);
    }

    render() {
        return (
            <div>
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              schemaProperties={this.state.schema.properties}/>
                <PatientList patients={this.state.patients}
                             links={this.state.links}
                             pageSize={this.state.pageSize}
                             page={this.state.page}
                             attributes={this.state.attributes}
                             searchInput={this.state.searchInput}
                             onNavigate={this.onNavigate}
                             onDelete={this.onDelete}
                             onUpdate={this.onUpdate}
                             updatePageSize={this.updatePageSize}
                             searchPatient={this.searchPatient}
                />
            </div>
        )
    }

    reloadPatients(pageSize, searchInput) {
        var RELOAD_SCHEMA = true;
        this.loadFromServer(pageSize, 0, searchInput, RELOAD_SCHEMA);
    }

    refreshCurrentPage(message) {
        this.loadFromServer(this.state.pageSize, this.state.page.number, this.state.searchInput);
    }

    searchPatient(searchInput) {
        this.loadFromServer(this.state.pageSize, 0, searchInput);
    }

    loadFromServer(pageSize, pageNumber, searchInput, reloadSchema) {

        var relArray = this.getRelArray(pageSize, pageNumber, searchInput, reloadSchema);

        follow(client, root, relArray).then(patientsCollection => {
            this.page = patientsCollection.entity.page;
            if (reloadSchema) {
                return client({
                    method: 'GET',
                    path: patientsCollection.entity._links.profile.href,
                    headers: {'Accept': 'application/schema+json'}
                }).then(schema => {
                    this.schema = schema.entity;
                    this.links = patientsCollection.entity._links;
                    return patientsCollection;
                });
            } else {
                return patientsCollection;
            }
        }).then(patientsCollection => {
            this.page = patientsCollection.entity.page;
            return patientsCollection.entity._embedded.patients.map(patient =>
                client({
                    method: 'GET',
                    path: patient._links.self.href
                })
            );
        }).then(patientsPromises => {
            return when.all(patientsPromises);
        }).done(patientsCollection => {
            this.setState({
                patients: patientsCollection,
                page: this.page,
                pageSize: pageSize,
                searchInput: searchInput,
                attributes: Object.keys(this.schema.properties),
                links: this.links,
                totalElements: this.page.totalElements,
                schema: this.schema
            });
        });
    }

    getRelArray(pageSize, pageNumber, searchInput, reloadSchema) {
        var relArray = ['patients', 'search', {
            rel: 'nameContains',
            params: {
                size: pageSize,
                page: pageNumber,
                name: searchInput
            }
        }];

        if (reloadSchema) {
            relArray = [{
                rel: 'patients',
                params: {
                    size: pageSize,
                    page: pageNumber,
                    name: searchInput
                }
            }];
        }
        return relArray;
    }


    onCreate(newPatient) {
        follow(client, root, ['patients']).then(patientsCollection => {
            return client({
                method: 'POST',
                path: patientsCollection.entity._links.self.href,
                entity: newPatient,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'patients', params: {'size': this.state.pageSize}}]);
        }).done(response => {
            //navigate to the newly added entity
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    onUpdate(patient, updatedPatient) {

        return client({
            method: 'PUT',
            path: patient._links.self.href,
            entity: updatedPatient,
            headers: {'Content-Type': 'application/json'}
        });
    }

    onDelete(patient) {
        client({method: 'DELETE', path: patient.entity._links.self.href});
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.pageSize) {
            this.reloadPatients(pageSize);
        }
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri})
            .then(patientsCollection => {
                this.links = patientsCollection.entity._links;
                this.page = patientsCollection.entity.page;

                return patientsCollection.entity._embedded.patients.map(patient =>
                    client({
                        method: 'GET',
                        path: patient._links.self.href
                    })
                );
            }).then(patientsPromises => {
            return when.all(patientsPromises);
        }).done(patientsCollection => {
            this.setState({
                patients: patientsCollection,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                page: this.page,
                links: this.links
            });
        });
    }
}

