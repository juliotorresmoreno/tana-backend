import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

const tableName = 'mmlus';

@Entity({
  name: tableName,
  synchronize: true,
})
export class Mmlu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 100, default: '', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 256, default: '', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, default: '', nullable: true })
  feeling: string;

  @Column({ type: 'varchar', length: 1000, default: '', nullable: true })
  photo_url: string;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 256, default: '', nullable: true })
  path: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  creation_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at?: Date;
}
