import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/hooks/redux-hooks";
import { Check } from "lucide-react";
import { createUser } from "@/hooks/usersHooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePermissions } from "@/hooks/usersHooks";
const PERMISSIONS = ["ADMIN", "AGENT_DE_STOCK", "CONFIRMATEUR", "SAV"] as const;

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),
  password: z
    .string()
    .min(6, "Mot de passe trop court")
    .optional()
    .or(z.literal("")), // permet que le champ soit vide lors d'une édition
  permissions: z
    .array(z.enum(PERMISSIONS))
    .nonempty("Sélectionnez au moins une permission"),
});

type FormValues = z.infer<typeof schema>;

type User = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  permissions: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: User | null;
};

const UserFormDialog = ({ open, onClose, initialData }: Props) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        password: "",
        permissions: initialData.permissions as FormValues["permissions"],
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const permissions = watch("permissions");

  const togglePermission = (perm: (typeof PERMISSIONS)[number]) => {
    const current = permissions.includes(perm);
    const updated = current
      ? permissions.filter((p) => p !== perm)
      : [...permissions, perm];
    setValue("permissions", updated);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted", data);
    if (initialData?.id) {
      await dispatch(
        updatePermissions({ id: initialData.id, permissions: data.permissions })
      );
    } else {
      await dispatch(createUser(data));
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {initialData ? (
            // 🔧 Mode modification : n'afficher que les permissions
            <>
              <div>
                <Label className="block mb-2">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((perm) => {
                    const checked = permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`cursor-pointer px-3 py-2 rounded-full text-sm flex items-center gap-1
                border transition duration-200
                ${
                  checked
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "bg-[#F3F5F6] border-gray-300 text-gray-700 hover:bg-gray-200"
                }
              `}
                      >
                        {checked && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                        {perm}
                      </label>
                    );
                  })}
                </div>
                {errors.permissions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            // ➕ Mode création : tout le formulaire
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-1 block">
                    Nom
                  </Label>
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="mb-1 block">
                    Email
                  </Label>
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-1 block">
                    Téléphone
                  </Label>
                  <Input
                    {...register("phone")}
                    placeholder="+213..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="mb-1 block">
                    Mot de passe
                  </Label>
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="Aa@123456"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="block mb-2">Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {PERMISSIONS.map((perm) => {
                    const checked = permissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        onClick={() => togglePermission(perm)}
                        className={`cursor-pointer px-3 py-2 rounded-full text-sm flex items-center gap-1
                border transition duration-200
                ${
                  checked
                    ? "bg-orange-100 border-orange-500 text-orange-700"
                    : "bg-[#F3F5F6] border-gray-300 text-gray-700 hover:bg-gray-200"
                }
              `}
                      >
                        {checked && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                        {perm}
                      </label>
                    );
                  })}
                </div>
                {errors.permissions && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" style={{ background: "#F8A67E" }}>
              {initialData ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
