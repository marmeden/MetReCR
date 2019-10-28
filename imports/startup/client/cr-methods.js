import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import Fleet from '../../api/fleet/fleet';


console.log("mis metodos");

export const startedLoading = new Date()
export let firstFlag = true

export function callMe() {
    console.log("somebody called me");
}

export function moneyFormatter(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function isWithOwnCars(carName) {
    let isOwn = false;
    let allNames = Fleet.find({}, {fields: {nombreCoche: 1}}).fetch().map((car) => {
        return car.nombreCoche;
    });

    (allNames.includes(carName))? isOwn = true : isOwn = false;

    return isOwn;
}

export function getUserInitials() {
    let email = Meteor.user().emails[0].address;
    email = email.slice(0, email.indexOf("@"));
    email = email.substring(0, 2);
    return email;
} 