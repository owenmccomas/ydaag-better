import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const todosRouter = createTRPCRouter({
  getTodos: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma.todo.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getTodo: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma.todo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  addTodo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      });
    }),

  deleteTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
  archiveTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
        },
      });
    }),

  updateTodoNote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        note: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          notes: input.note,
        },
      });
    }),

  updateCompleted: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          completed: input.completed,
        },
      });
    }
  ),  
});
