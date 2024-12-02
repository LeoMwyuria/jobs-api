import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job, JobSchema } from './schemas/job.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutes
      max: 100,
    }),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}