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
import { Checkbox } from "./ui/checkbox";
import { Trash } from "lucide-react"

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
  const updateCompleted = api.todo.updateCompleted.useMutation();

  const context = api.useContext();

  const handleCheckboxClick = async (id: string, completed: boolean) => {
    console.log("handleCheckboxClick called");

    // Update the local state immediately
    setSelectedTodo((prevTodo) => {
      if (!prevTodo || prevTodo.id !== id) return prevTodo;
      return {
        ...prevTodo,
        completed: !completed,
      };
    });

    try {
      // Perform the API call asynchronously after updating the local state
      console.log("Before API call");
      await updateCompleted.mutateAsync(
        { id, completed: !completed },
        {
          onSuccess: () => {
            // Invalidate the context after successful API call
            context.todo.invalidate();
          },
          onError: (error) => {
            // If the API call fails, revert the local state back to the original value
            setSelectedTodo((prevTodo) => {
              if (!prevTodo || prevTodo.id !== id) return prevTodo;
              return {
                ...prevTodo,
                completed: completed,
              };
            });
            console.error("Error updating completed status:", error);
          },
        }
      );
      console.log("After API call");
    } catch (error) {
      // Handle errors if needed
      console.error("Error updating completed status:", error);
    }
  };

  const updateCompletedFunc = async (id: string, completed: boolean) => {
    try {
      // Perform the API call to update the completed status
      await updateCompleted.mutateAsync({ id, completed });

      // After the API call is successful, invalidate the context
      context.todo.invalidate();
    } catch (error) {
      // Handle errors if needed
      console.error("Error updating completed status:", error);
    }
  };

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

  const deletefunc = (todo: Todo) => {
    deleteTodo.mutate(
      { id: todo.id },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          context.todo.invalidate();
        },
      }
    );
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

  const updateNotes = (e: FormEvent) => {
    e.preventDefault();
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
    <div className="mt-0 rounded-xl border border-gray-100 border-opacity-30 pt-0">
      <Modal open={showNewTodoModal} setOpen={setShowNewTodoModal}>
        <div className="bg-fg rounded-xl p-5">
          <form onSubmit={submitNewTodo}>
            <p className="text-fg mb-1">Title your todo</p>
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.currentTarget.value)}
              className="focus:border-1 bg-bg border-gray-300 text-foreground"
              type="text"
            />
          </form>
        </div>
      </Modal>
      <Modal
        open={Boolean(selectedTodo)}
        setOpen={() => setSelectedTodo(undefined)}
      >
        <div className="rounded-lg bg-white">
          <div className="px-6 py-4">
            <p className="text-fg mb-4 text-center text-xl font-bold">
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
              className="w-full rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
              rows={4}
              placeholder="Add notes..."
            />
          </div>
          {/* <div className="flex items-center justify-end rounded-b-lg bg-gray-100 px-4 py-3">
            <SettingsBar archivefunc={archivefunc} deletefunc={deletefunc} />
          </div> */}
        </div>
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
              <TableHead className="w-[30px]">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.data?.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="text-fg font-medium">
                  <Checkbox
                    checked={
                      selectedTodo?.id === todo.id
                        ? selectedTodo.completed
                        : todo.completed
                    }
                    onClick={() => handleCheckboxClick(todo.id, todo.completed)}
                  />
                </TableCell>
                <TableCell onClick={() => setSelectedTodo(todo)} key={todo.id}>
                  <div className="max-w-[400px] font-medium text-black">
                    {todo.title}
                  </div>
                </TableCell>
                <TableCell className="text-fg float-right">
                  {format(todo.createdAt, "MMMM d, yyyy")}
                </TableCell>
                <TableCell>
                <Button variant={"ghost"} size={'sm'} className={'text-black float-right'} onClick={() => deletefunc(todo)}>
                  <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <Button
              variant={"link"}
              onClick={() => setShowNewTodoModal(true)}
              className="text-2xl"
            >
              +
            </Button>
          </TableBody>
        </Table>
      )}
    </div>
  );
};
