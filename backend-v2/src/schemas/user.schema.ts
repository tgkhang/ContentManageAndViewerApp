import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password; // Always exclude password from JSON responses
      return ret;
    },
  },
})
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  })
  email: string;

  @Prop({
    required: true,
    select: false, // Don't include password in queries by default
  })
  password?: string;

  @Prop({
    required: true,
    enum: ['admin', 'editor', 'client'],
    default: 'client',
  })
  role: string;

  @Prop({
    type: String,
    ref: 'User',
  })
  createdBy?: string;

  @Prop({
    type: String,
    ref: 'User',
  })
  updatedBy?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add compound indexes for better query performance
UserSchema.index({ email: 1, username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Text index for search functionality
UserSchema.index({
  name: 'text',
  username: 'text',
  email: 'text',
});
