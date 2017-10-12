const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ROLES = require('../constants').ROLES;
const bitcoin = require('../utils/bitcoin-utils.js');
const autoIncrement = require('mongoose-auto-increment');
// TODO why this no work?
const yubConfig = require('./../config/index.js');
const yub = require('yub');

console.log('********* ', yubConfig);
yub.init('30361', 'm35xOnkDmB5LTDwKL3JAiKAsxU0=');
const when = require('when');

const Schema = mongoose.Schema;

autoIncrement.initialize(mongoose);


//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  customerId: { type: String, required: true, default: 0 },
  password: { type: String, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  role: {
    type: String,
    enum: Object.keys(ROLES).map(key => ROLES[key]),
    default: ROLES.USER,
  },
  bitcoin: { type: String },
  yubikey: { type: String, required: false },
  yubiID: { type: String, required: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  billing: {
    subscriptionId: { type: String },
    plan: { type: String },
    nextPaymentDue: { type: Date },
  },
  deactivated: { type: Boolean, default: false },
},
{
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});


UserSchema.virtual('fullName').get(function virtualFullName() {
  return `${this.name.first} ${this.name.last}`;
});

//= ===============================
// User model hooks
//= ===============================
UserSchema.plugin(autoIncrement.plugin, 'customerId');

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', async function hashPassword(next) {
  const user = this;
  if (user && user.isModified('password')) {
    try {
      const authYubi = function (auth) {
        const d = when.defer();
        const tag = ' | yubikey | '
        const debug = false;
        yub.verify(auth, (err, data) => {
          if (debug) console.log(tag, 'data:', data);
          if (debug) console.log(tag, 'err:', data);
          if (!err && data.valid && data.signatureVerified && data.nonceVerified >= 0) {
            console.log(tag, ' Successful AUTH: ');
            d.resolve(data);
          } else {
            console.error(tag, ' Failed to auth! err: ', err);
            d.resolve(false);
          }
        });

        return d.promise;
      };

      if (user.yubikey) {
        const success = await authYubi(user.yubikey);
        console.log(success);
        if (success.valid) {
          user.yubiID = success.identity;
          this.yubiID = success.identity;
        } else {
          console.error('invalid yubikey!!');
        }
      }

      const salt = await bcrypt.genSalt(5);
      console.log('user: ', user);
      user.bitcoin = await bitcoin.getDeposit(user._id);
      user.password = await bcrypt.hash(user.password, salt, null);
      return next();
    } catch (err) {
      return next(err);
    }
  } else {
    return next();
  }
});

//= ===============================
// User model methods
//= ===============================
// Method to compare password for login
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model('User', UserSchema);
