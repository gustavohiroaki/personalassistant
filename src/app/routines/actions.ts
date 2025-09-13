"use server";
import { IRoutineInput } from "@/@core/domain/entities/routine.entity";
import { redirect } from "next/navigation";
import { CreateRoutineUseCase } from "@/@core/application/usecases/routines/create-routine.usecase";
import { UpdateRoutineUseCase } from "@/@core/application/usecases/routines/update-routine.usecase";
import RoutineSqliteRepository from "@/@core/infrastructure/repositories/routines/sqlite/routine.repository";
const routineRepository = new RoutineSqliteRepository();
export async function createRoutineAction(data: IRoutineInput) {
  try {
    const createRoutineUseCase = new CreateRoutineUseCase(routineRepository);
    await createRoutineUseCase.execute(data);
    redirect("/routines");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao criar rotina");
  }
}
export async function updateRoutineAction(id: string, data: Partial<IRoutineInput>) {
  try {
    const updateRoutineUseCase = new UpdateRoutineUseCase(routineRepository);
    await updateRoutineUseCase.execute({ id, updates: data });
    redirect("/routines");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao atualizar rotina");
  }
}
export async function deleteRoutineAction(id: string) {
  try {
    await routineRepository.delete(id);
    redirect("/routines");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao excluir rotina");
  }
}
export async function toggleRoutineActiveAction(id: string, active: boolean) {
  try {
    const routine = await routineRepository.findById(id);
    if (!routine) {
      throw new Error("Rotina não encontrada");
    }
    const updateRoutineUseCase = new UpdateRoutineUseCase(routineRepository);
    await updateRoutineUseCase.execute({
      id,
      updates: { active }
    });
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erro ao atualizar rotina");
  }
}
