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
import { type FormEvent, useState } from "react";
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

  const context = api.useContext();

  const submitNewTodo = (e: FormEvent) => {
    e.preventDefault();
    newTodo.mutate(
      { userId, title: titleInput },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          context.todo.invalidate();
        },
      }
    );
    setTitleInput(""); // Reset the titleInput to an empty string
    setShowNewTodoModal(false);
  };
  

  const deletefunc = () => {
    if (!selectedTodo?.id) return;
    deleteTodo.mutate(
      { id: selectedTodo?.id },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          context.todo.invalidate();
        },
      }
    );
    setSelectedTodo(undefined);
  };

  const archivefunc = () => {
    if (!selectedTodo?.id) return;
    archiveTodo.mutate(
      { id: selectedTodo?.id },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          context.todo.invalidate();
        },
      }
    );
    setSelectedTodo(undefined);
  };

  const updateNotes = () => {
    if (!selectedTodo?.notes) return;
    updateNote.mutate(
      { id: selectedTodo?.id, note: selectedTodo?.notes },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          context.todo.invalidate();
        },
      }
    );
    setSelectedTodo(undefined);
  };

  return (
    <div className="mt-0 w-9/12 rounded-xl border border-gray-100 border-opacity-30 pt-0">
      <Modal open={showNewTodoModal} setOpen={setShowNewTodoModal}>
        <div className="bg-fg rounded-xl p-5">
          <form onSubmit={submitNewTodo}>
            <p className="mb-1 text-fg">Title your todo</p>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.currentTarget.value)}
              className="focus:border-1 border-gray-50 bg-bg text-foreground"
              type="text"
            />
          </form>
        </div>
      </Modal>
      <Modal
        open={Boolean(selectedTodo)}
        setOpen={() => setSelectedTodo(undefined)}
      >
        <div className="w-48 rounded-xl bg-background pb-3 px-4 pt-2 ">
          <p className="textforeground mb-2 text-center text-xl">
            {selectedTodo?.title}
          </p>
          <textarea
            onBlur={updateNotes}
            value={selectedTodo?.notes || ""}
            onChange={(e) =>
              setSelectedTodo({
                ...selectedTodo!,
                notes: e.currentTarget.value,
              })
            }
            className="p-1 w-full rounded-md border border-black"
            rows={4}
          />
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
          <Button
            variant={"outline"}
            className="mx-auto"
            onClick={() => setShowNewTodoModal(true)}
          >
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
                <TableRow onClick={() => setSelectedTodo(todo)} key={todo.id}>
                  <TableCell className="text-fg font-medium">
                    {todo.title}
                  </TableCell>
                  <TableCell>
                    {todo.completed ? (
                      <span className="uppercase text-destructive">closed</span>
                      ) : (
                        <span className="uppercase text-green-200">open</span>
                        )}
                  </TableCell>
                  <TableCell className="text-fg truncate font-medium">
                    {todo.id}
                  </TableCell>
                  <TableCell className="text-fg float-right">
                    {format(todo.createdAt, "MMMM d, yyyy")}
                  </TableCell>
                </TableRow>
              );
            })}
            <Button variant={'link'} onClick={() => setShowNewTodoModal(true)} className="text-2xl">+</Button>
          </TableBody>
        </Table>
      )}
    </div>
  );
};
