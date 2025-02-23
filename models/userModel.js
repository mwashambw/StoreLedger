const { mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      require: [true, 'Please provide your email'],
      unique: [true, 'The email address already exists.'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      trim: true,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm a password'],
      validate: {
        validator: function (passwordConf) {
          return passwordConf === this.password;
        },
        message: 'Password do not match',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    photo: {
      type: String,
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // Only run function when password is modified
  if (!this.isModified('password')) return next();
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);
  // Delete password confirm password
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamps) {
  if (this.passwordChangedAt) {
    return JWTTimestamps < +this.passwordChangedAt.getTime() / 1000;
  }
  // False means Not changed
  return false;
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000;
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
