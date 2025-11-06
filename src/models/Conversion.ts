import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

export enum ConversionStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
}

@Entity('conversions')
export class Conversion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalFileName!: string;

  @Column({ nullable: true })
  convertedFileName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ConversionStatus,
    default: ConversionStatus.Pending,
  })
  status!: ConversionStatus;

  @Column({ type: 'simple-json', nullable: true })
  conversionParams?: Record<string, any>;

  @Column({ nullable: true })
  outputFilePath?: string;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @ManyToOne(() => User, (user) => user.conversions)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// Add the inverse relation to User entity
declare module './User' {
  interface User {
    conversions?: Conversion[];
  }
}
