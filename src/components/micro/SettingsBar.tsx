import { Archive, Trash2, Rows } from "lucide-react"
import { useRouter } from "next/router"
import React from "react"

export const SettingsBar = ({
    deletefunc, archivefunc,
} : {
    deletefunc: () => void,
    archivefunc: () => void
}) => {

    return (
        <div className="bg-foreground opacity rounded-xl mx-auto opacity-30 h-8 w-24 z-50 flex justify-around">
            <button onClick={archivefunc}><Archive className="fill-gray-100 hover:fill-white hover:scale-105 transition-all hover:shadow-xl shadow-white" /></button>
            <button onClick={deletefunc}><Trash2 className="fill-gray-100 hover:fill-red-500 hover:scale-105 transition-all hover:shadow-xl shadow-white" /></button>
        </div>
    )
}