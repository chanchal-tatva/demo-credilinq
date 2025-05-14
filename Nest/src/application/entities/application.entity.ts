import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Company Information
  @Column({ nullable: true })
  companyUEN: string;

  @Column({ nullable: true })
  companyName: string;

  // Application Information
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  mobileNumber: string;

  // Terms and Conditions
  @Column({ nullable: true, default: false })
  termsAccepted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Document, (document) => document.application)
  documents: Document[];
}