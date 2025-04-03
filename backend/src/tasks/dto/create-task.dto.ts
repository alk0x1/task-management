import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar autenticação' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @ApiProperty({ example: 'Criar sistema de login e registro com JWT', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
