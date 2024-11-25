import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import * as timeago from 'timeago.js';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>
  ) {}

  async create(createJobDto: CreateJobDto): Promise<JobDto> {
    try {
      const createdJob = new this.jobModel(createJobDto);
      const job = await createdJob.save();
      return this.toJobDto(job);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(
          'Invalid job data provided: ' + error.message
        );
      }
      throw error;
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginationResponseDto<JobDto>> {
    const { page = 1, limit = 9 } = paginationQuery;
    try {
      const skip = (page - 1) * limit;

      const [jobs, totalItems] = await Promise.all([
        this.jobModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.jobModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items: jobs.map(job => this.toJobDto(job)),
        meta: {
          totalItems,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        'Error fetching jobs: ' + error.message
      );
    }
  }

  async findOne(id: string): Promise<JobDto> {
    try {
      const job = await this.jobModel.findById(id).exec();
      if (!job) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      return this.toJobDto(job);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error fetching job: ' + error.message
      );
    }
    
  }
  async remove(id: string): Promise<void> {
    try {
      const result = await this.jobModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error deleting job: ' + error.message
      );
    }
  }

  private toJobDto(job: JobDocument): JobDto {
    return {
      id: job._id.toString(),
      title: job.title,
      companyName: job.companyName,
      logoUrl: job.logoUrl,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      timeAgo: timeago.format(job.createdAt),
      createdAt: job.createdAt,
      type: job.type,
      location: job.location
    };
  }
  
  
}