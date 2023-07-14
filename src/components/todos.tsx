import { api } from "~/utils/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { type FormEvent, useEffect, useState } from "react";
import Modal from "./modals";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { type Todo } from "@prisma/client";
import { SettingsBar } from "./micro/SettingsBar";

export const TodoList = ({ userId }: { userId: string }) => {
  const [showNewTodoModal, setShowNewTodoModal] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [titleInput, setTitleInput] = useState<string>("");

  const todos = api.todo.getTodos.useQuery(
    { userId },
    { refetchOnMount: true }
  );
  const newTodo = api.todo.addTodo.useMutation();
  const deleteTodo = api.todo.deleteTodo.useMutation();
  const archiveTodo = api.todo.archiveTodo.useMutation();
  const updateNote = api.todo.updateTodoNote.useMutation();

  const context = api.useContext()

  const submitNewTodo = (e: FormEvent) => {
    e.preventDefault();
    newTodo.mutate({ userId, title: titleInput }, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        context.todo.invalidate()
      }
    } );
    setShowNewTodoModal(false);
  };

  const deletefunc = () => {
    if (!selectedTodo?.id) return
    deleteTodo.mutate({ id: selectedTodo?.id }, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        context.todo.invalidate()
      }
    } );
    setSelectedTodo(undefined);
  }

  const archivefunc = () => {
    if (!selectedTodo?.id) return
    archiveTodo.mutate({ id: selectedTodo?.id}, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        context.todo.invalidate()
      }
    } );
    setSelectedTodo(undefined);
  }

  const updateNotes = () => {
    if (!selectedTodo?.notes) return
    updateNote.mutate({ id: selectedTodo?.id, note: selectedTodo?.notes }, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        context.todo.invalidate()
      }
    } );
    setSelectedTodo(undefined);
  }

  return (
    <div className="mt-0 w-9/12 rounded-xl border border-gray-100 border-opacity-30 pt-0">
      <Modal open={showNewTodoModal} setOpen={setShowNewTodoModal}>
        <div className="rounded-xl bg-foreground p-5">
          <form onSubmit={submitNewTodo}>
            <p className="mb-1 text-primary-foreground">Title your todo</p>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.currentTarget.value)}
              className="focus:border-1 border-gray-50 bg-foreground text-primary-foreground"
              type="text"
            />
          </form>
        </div>
      </Modal>
      <Modal
        open={Boolean(selectedTodo)}
        setOpen={() => setSelectedTodo(undefined)}
      >
        <div className="rounded-xl bg-gray-200 p-5 h-96 w-48 ">
            <p className="text-xl text-center text-primary-foreground">{selectedTodo?.title}</p>
            <textarea onBlur={updateNotes} value={selectedTodo?.notes || ''} onChange={(e)=>setSelectedTodo({...selectedTodo!, notes: e.currentTarget.value })} className="w-full" rows={4} />
        </div>
        <SettingsBar archivefunc={archivefunc} deletefunc={deletefunc} />
      </Modal>

      <button
        onClick={() => setShowNewTodoModal(true)}
        className="-translate-x-7 text-primary-foreground"
      >
        +
      </button>

      {todos.data?.length === 0 ? (
        <div className="flex h-24 flex-col items-center justify-between">
          <p className="text-center text-foreground">{`Looks like you don't have any todos`}</p>
          <Button variant={'outline'} className="mx-auto" onClick={() => setShowNewTodoModal(true)}>
            Start using Todos
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your Todos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.data?.map((todo) => {
              return (
                <TableRow onClick={()=>setSelectedTodo(todo)} key={todo.id}>
                  <TableCell className="font-medium text-fg">{todo.title}</TableCell>
                  <TableCell>{todo.completed ? <span className="text-destructive uppercase">closed</span> : <span className="text-green-200 uppercase">open</span>}</TableCell>
                  <TableCell className="font-medium truncate text-fg">{todo.id}</TableCell>
                  <TableCell className="float-right text-fg">{format(todo.createdAt, "MMMM d, yyyy")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
