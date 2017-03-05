"use strict";
module.exports = (function () {
    function Alias(alias, command) {
        this.alias = alias;
        this.command = command;
    }
    return Alias;
}());
