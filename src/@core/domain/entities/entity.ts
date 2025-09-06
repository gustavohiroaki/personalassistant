export abstract class Entity {
  abstract id: string;
  abstract createdAt: Date;
  abstract updatedAt?: Date;

  abstract toJSON(): object;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static fromJSON(json: object): Entity {
    throw new Error("fromJSON must be implemented in the derived class");
  }
}
