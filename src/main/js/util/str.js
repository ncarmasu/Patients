'use strict';

const React = require('react');

export default class Str extends React.Component {

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}
