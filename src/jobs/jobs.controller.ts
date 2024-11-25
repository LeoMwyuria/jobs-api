import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobDto } from './dto/job.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto): Promise<JobDto> {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<PaginationResponseDto<JobDto>> {
    return this.jobsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<JobDto> {
    return this.jobsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.jobsService.remove(id);
  }
}