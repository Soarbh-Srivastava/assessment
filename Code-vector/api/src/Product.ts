import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity()
@Index(["createdAt", "id"])
@Index(["category", "createdAt", "id"])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() name: string;
  @Column() category: string;
  @Column("decimal") price: number;
  @CreateDateColumn() createdAt: Date;
}