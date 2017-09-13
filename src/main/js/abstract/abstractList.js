'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

export default class AbstractList extends React.Component {

    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.buildNavLinks = this.buildNavLinks.bind(this);
        this.search = this.search.bind(this);
    }

    render() {
        var tableHead = this.getTableHead();
        var tableBody = this.getTableBody();

        var navLinks = this.buildNavLinks();

        return (
            <div>
                <input type="search" ref="searchInput" placeholder="Search" onInput={this.search}/>
                <label> Total {this.props.totalElements}</label>
                <div id="pageSizeControls" className="pageSizeControls">
                    <label>Size </label>
                    <input type="number" ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}
                           min="1" max={this.props.totalElements}/>
                </div>
                <table>
                    <tbody>
                    {tableHead}
                    {tableBody}
                    </tbody>
                </table>

                <div id="navLinks">
                    <span className="navLinks">
                        {navLinks}
                        <label className="pageIndex"> Page {this.props.page ? this.props.page.number + 1 : '1'}
                            of {this.props.page ? this.props.page.totalPages : '1'}</label>
                    </span>
                </div>
            </div>
        )
    }

    getTableHead() {
    }

    getTableBody() {
    }

    buildNavLinks() {
        var navLinks = [];
        if (this.props.links) {
            if ("first" in this.props.links) {
                navLinks.push(<i key="first" onClick={this.handleNavFirst} className="material-icons">first_page</i>);
            }
            if ("prev" in this.props.links) {
                navLinks.push(<i key="prev" onClick={this.handleNavPrev} className="material-icons">chevron_left</i>);
            }
            if ("next" in this.props.links) {
                navLinks.push(<i key="next" onClick={this.handleNavNext} className="material-icons">chevron_right</i>);
            }
            if ("last" in this.props.links) {
                navLinks.push(<i key="last" onClick={this.handleNavLast} className="material-icons">last_page</i>);
            }
        }
        return navLinks;
    }

    // tag::handle-page-size-updates[]
    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        //if number
        if (/^[0-9]+$/.test(pageSize)) {
            if (pageSize < 1) {
                pageSize = 1;
            }
            this.props.updatePageSize(pageSize);
        } else {
            //revert to the list size
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    // end::handle-page-size-updates[]

    handleNavFirst(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    search(e) {
        e.preventDefault();
        var searchInput = ReactDOM.findDOMNode(this.refs.searchInput).value;
        this.executeSearch(searchInput);
    }

    executeSearch(searchInput) {
    }
}