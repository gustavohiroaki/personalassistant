export interface IRepository<TCreate, TUpdate, T> {
    findById(id: string): Promise<T | null>;
    find(findParams: object): Promise<T[]>;
    create(entity: TCreate): Promise<T>;
    update(id: string, entity: TUpdate): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}   