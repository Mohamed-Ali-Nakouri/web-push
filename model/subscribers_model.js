const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({});

mongoose.model('subscribers', SubscriberSchema, 'subscribers');