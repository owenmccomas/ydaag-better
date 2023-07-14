import { Archive, Trash2 } from "lucide-react";
// import { useRouter } from "next/router"
import React from "react";

export const SettingsBar = ({
  deletefunc,
  archivefunc,
}: {
  deletefunc: () => void;
  archivefunc: () => void;
}) => {
  return (
    <div className="opacity z-50 mx-auto flex h-8 w-24 justify-around rounded-xl bg-foreground opacity-30">
      <button onClick={archivefunc}>
        <Archive className="fill-gray-100 shadow-white transition-all hover:scale-105 hover:fill-white hover:shadow-xl" />
      </button>
      <button onClick={deletefunc}>
        <Trash2 className="fill-gray-100 shadow-white transition-all hover:scale-105 hover:fill-red-500 hover:shadow-xl" />
      </button>
    </div>
  );
};
