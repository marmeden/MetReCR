import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import Fleet from '../../api/fleet/fleet';


console.log("mis metodos");
export function callMe() {
    console.log("somebody called me");
} 

export function isWithOwnCars(carName) {
    let isOwn = false;
    let allNames = Fleet.find({}, {fields: {nombreCoche: 1}}).fetch().map((car) => {
        return car.nombreCoche;
    });

    (allNames.includes(carName))? isOwn = true : isOwn = false;

    return isOwn;
}