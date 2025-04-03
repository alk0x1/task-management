import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus, Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
        user: {
          connect: { id: userId }
        }
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    userId?: string;
  }) {
    const { skip, take, cursor, where, orderBy, userId } = params;
    
    const filter: Prisma.TaskWhereInput = {
      ...where,
      ...(userId && { userId }),
    };

    const tasks = await this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where: filter,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const count = await this.prisma.task.count({
      where: filter,
    });

    return {
      data: tasks,
      meta: {
        total: count,
        page: skip ? Math.floor(skip / (take || 10)) + 1 : 1,
        lastPage: Math.ceil(count / (take || 10)),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getUpcomingTasks(daysThreshold = 3) {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: thresholdDate,
        },
        status: {
          not: TaskStatus.COMPLETED
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailNotifications: true,
          },
        },
      },
    });
  }
}