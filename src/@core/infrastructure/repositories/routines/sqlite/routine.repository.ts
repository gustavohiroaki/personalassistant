import { Routine } from "@/@core/domain/entities/routine.entity";
import db from "../../../database/sqlite-connection";
import { IRoutineRepository } from "../routines.repository.interface";

class RoutineSqliteRepository implements IRoutineRepository {
  async create(entity: Routine): Promise<boolean> {
    const routineData = entity.toJSON();
    
    // Serializa arrays para JSON strings
    const dbData = {
      ...routineData,
      taskIds: JSON.stringify(routineData.taskIds),
      daysOfWeek: routineData.daysOfWeek ? JSON.stringify(routineData.daysOfWeek) : null,
      daysOfMonth: routineData.daysOfMonth ? JSON.stringify(routineData.daysOfMonth) : null,
    };

    await db("routines").insert(dbData);
    return true;
  }

  async findAll(): Promise<Routine[]> {
    const routines = await db("routines").select("*");
    return routines.map((routine) => this.mapFromDatabase(routine));
  }

  async findById(id: string): Promise<Routine | null> {
    const routine = await db("routines").where({ id }).first();
    if (!routine) {
      return null;
    }
    return this.mapFromDatabase(routine);
  }

  async update(entity: Routine): Promise<boolean> {
    const routineData = entity.toJSON();
    
    // Serializa arrays para JSON strings
    const dbData = {
      ...routineData,
      taskIds: JSON.stringify(routineData.taskIds),
      daysOfWeek: routineData.daysOfWeek ? JSON.stringify(routineData.daysOfWeek) : null,
      daysOfMonth: routineData.daysOfMonth ? JSON.stringify(routineData.daysOfMonth) : null,
    };

    await db("routines").where({ id: entity.id }).update(dbData);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await db("routines").where({ id }).delete();
    return true;
  }

  // Métodos específicos para rotinas
  async findActiveRoutines(): Promise<Routine[]> {
    const routines = await db("routines").where({ active: true }).select("*");
    return routines.map((routine) => this.mapFromDatabase(routine));
  }

  async findByFrequency(frequency: string): Promise<Routine[]> {
    const routines = await db("routines").where({ frequency }).select("*");
    return routines.map((routine) => this.mapFromDatabase(routine));
  }

  private mapFromDatabase(dbRoutine: Record<string, unknown>): Routine {
    // Deserializa JSON strings para arrays
    const routineData = {
      id: dbRoutine.id as string,
      createdAt: dbRoutine.createdAt as string,
      updatedAt: dbRoutine.updatedAt as string | undefined,
      title: dbRoutine.title as string,
      description: dbRoutine.description as string | undefined,
      frequency: dbRoutine.frequency as "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom",
      startDate: dbRoutine.startDate as string,
      endDate: dbRoutine.endDate as string | undefined,
      active: Boolean(dbRoutine.active),
      taskIds: dbRoutine.taskIds ? JSON.parse(dbRoutine.taskIds as string) : [],
      daysOfWeek: dbRoutine.daysOfWeek ? JSON.parse(dbRoutine.daysOfWeek as string) : undefined,
      dayOfMonth: dbRoutine.dayOfMonth as number | undefined,
      daysOfMonth: dbRoutine.daysOfMonth ? JSON.parse(dbRoutine.daysOfMonth as string) : undefined,
      month: dbRoutine.month as number | undefined,
      dayOfYear: dbRoutine.dayOfYear as number | undefined,
      customRule: dbRoutine.customRule as string | undefined,
    };

    return Routine.fromJSON(routineData);
  }
}

export default RoutineSqliteRepository;
