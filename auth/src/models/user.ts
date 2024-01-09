import { Password } from './../services/password';
import mongoose from 'mongoose';

// an interface to describe the properties to crate a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface to describe the properties that a user Model have
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface to describe the properties of a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        // versionKey: false;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// <UserDoc, UserModel> are Generic Type arguments for the function model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// sample code for testing
// const user = User.build({
//   email: 'test@test.com',
//   password: 'password',
// });

export { User };
