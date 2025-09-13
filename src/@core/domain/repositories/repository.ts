import { Entity } from "../entities/entity";
export interface IRepository<E extends Entity> {
  create(entity: E): Promise<boolean>;
  findAll(): Promise<E[]>;
  findById(id: string): Promise<E | null>;
  update(entity: E): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
