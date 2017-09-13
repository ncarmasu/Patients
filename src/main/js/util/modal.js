'use strict';
const React = require('react');

import ReactModal from "react-modal";

var style = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        width: '500px', /* Full width */
        height: 'fit-content',
    }
};

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
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
        return (
            <div>
                <i className="material-icons" title={this.props.buttonTitle}
                   onClick={this.handleOpenModal}>{this.props.materialIconName}</i>
                <ReactModal isOpen={this.state.showModal}
                            onRequestClose={this.handleCloseModal}
                            style={style}>
                    <div>
                        <button onClick={this.handleCloseModal} title="Close" className="close">X</button>
                        {this.props.content}
                    </div>
                </ReactModal>
            </div>);
    }
}