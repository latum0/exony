"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export interface Client {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  email: string;
  numeroTelephone: string;
  //   commentaires?: {
  //     contenu: string;
  //     date?: string;
  //   }[];
  statut: "ACTIVE" | "BLACKLISTED";
}

interface ClientColumnsProps {
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

export const getClientColumns = ({
  onEdit,
  onDelete,
}: ClientColumnsProps): ColumnDef<Client>[] => {
  return [
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "prenom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Prénom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "adresse",
      header: "Adresse",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "numeroTelephone",
      header: "Téléphone",
    },
    {
      accessorKey: "statut",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Statut
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("statut") as string;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status === "ACTIVE" ? "Actif" : "Blacklisté"}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const client = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 bg-none text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-blue-600 hover:text-blue-600/90 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(client.email)}
              >
                <Copy size={9} className="text-blue-600" />
                Copier l'email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEdit(client)}
                className="text-green-600 hover:text-green-600/90 cursor-pointer"
              >
                <Edit size={9} className="text-green-600" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => client.id && onDelete(client.id)}
                className="text-red-600 hover:text-red-600/90 cursor-pointer"
              >
                <Trash2Icon size={9} className="text-red-600" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
