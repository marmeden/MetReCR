// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Tasks = new Mongo.Collection('tasks');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  text: {
    type: String,
  },

  // Client Data 
  nombre: {
    type: String,
  },

  telefonoCliente: {
    type: String,
    optional: true
  },

  emailCliente: {
    type: String,
    optional: true
  },

  // Booking RecoDevoProcedencia
  recogida: {
    type: String
  },

  devolucion: {
    type: String
  },

  fechaReco: {
    type: Date,
    optional: true
  },

  fechaDevo: {
    type: Date,
    optional: true
  },

  recoWorker: {
    type: String,
    optional: true
  },

  recoWorkerID: {
    type: String,
    optional: true
  },

  devoWorker: {
    type: String,
    optional: true
  },

  devoWorkerID: {
    type: String,
    optional: true
  },

  procedencia: {
    type: String
  },

  userName: {
    type: String
  },

  createdAt: {
    type: Date
  },

  dias: {
    type: Number,
    optional: true
  },

  // Info Coche
  company: {
    type: String
  },

  tipo: {
    type: String
  },

  matricula: {
    type: String,
    optional: true
  },

  localizador: {
    type: String,
    optional: true
  },

  // Info Economica
  tarifa: {
    type: String
  },

  paidToCarflet: {
    type: String
  },

  costForCarflet: {
    type: String
  },

  qtyPendiente: {
    type: Number, 
    optional: true,
  },

  qtyPrepago: {
    type: Number,
    optional: true,
  },

  isComissioned: {
    type: Boolean,
    optional: true
  },

  comisionPerson: {
    type: String,
    optional: true
  },

  comisionEuros: {
    type: Number,
    optional: true,
  },

  comisionId: {
    type: String,
    optional: true
  },

  comisionDate: {
    type: Date,
    optional: true
  },

  // Status Reserva

  transfer: {
    type: Boolean,
    optional: true
  },

  pagada: {
    type: Boolean,
    optional: true
  },

  cancelada: {
    type: Boolean,
    optional: true
  }
});

// attach schema
Tasks.attachSchema(Schema);

export default Tasks;