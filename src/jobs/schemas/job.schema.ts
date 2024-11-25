import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ 
  timestamps: true,
})
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requirements: string;

  @Prop({ required: true })
  responsibilities: string;

  @Prop({ required: true, default: 'Full Time' })
  type: string;

  @Prop({ required: true })
  location: string;

  createdAt: Date;
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);