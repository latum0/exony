"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchCommandeStats,
  fetchClientStats,
  fetchRetourStats,
  fetchRetourCommandeStats,
} from "@/store/slices/statsSlice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { AppDispatch, RootState } from "@/store";
import {
  ArrowRightLeft,
  CalendarIcon,
  RotateCcw,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardStats() {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector((state: RootState) => state.stats);

  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [produitId, setProduitId] = useState("");

  const fetchAllStats = () => {
    if (!dateFrom || !dateTo) {
      return;
    }

    const params: {
      dateFrom: string;
      dateTo: string;
      produitId?: string;
    } = {
      dateFrom: format(dateFrom, "yyyy-MM-dd"),
      dateTo: format(dateTo, "yyyy-MM-dd"),
    };
    if (produitId) params.produitId = produitId;

    dispatch(fetchCommandeStats(params));
    dispatch(fetchClientStats(params));
    dispatch(fetchRetourStats(params));
    dispatch(fetchRetourCommandeStats(params));
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-balance">
            Tableau de Bord Statistiques
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Analysez vos performances en temps réel
          </p>
        </div>

        <Card className="border border-gray-200 shadow-lg  bg-[#fbfbfb]/80">
          <CardHeader className="pb-">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#F8A67E]" />
              Filtres de Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
              {/* Date From Calendar */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Date de Début
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-300 h-9 bg-white/50 hover:border-[#F8A67E] focus:border-[#F8A67E] focus:ring-2 focus:ring-[#F8A67E]/20  shadow-sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#F8A67E]" />
                      <span
                        className={`truncate ${
                          !dateFrom ? "text-gray-500" : ""
                        }`}
                      >
                        {dateFrom
                          ? format(dateFrom, "dd MMM yyyy", { locale: fr })
                          : "Sélectionner une date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-xl border border-gray-200 bg-white z-50"
                    align="start"
                    sideOffset={4}
                  >
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => setDateFrom(date)}
                      initialFocus
                      locale={fr}
                      className="rounded-lg border-0 bg-white"
                      classNames={{
                        day_selected:
                          "bg-[#F8A67E] text-white hover:bg-[#F8A67E] hover:text-white focus:bg-[#F8A67E] focus:text-white",
                        day_today: "bg-gray-100 text-gray-900",
                        day: "hover:bg-gray-100 focus:bg-gray-100",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To Calendar */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Date de Fin
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-gray-300 hover:border-[#F8A67E] focus:border-[#F8A67E] focus:ring-2 focus:ring-[#F8A67E]/20  h-9 bg-white/50 shadow-sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#F8A67E]" />
                      <span
                        className={`truncate ${!dateTo ? "text-gray-500" : ""}`}
                      >
                        {dateTo
                          ? format(dateTo, "dd MMM yyyy", { locale: fr })
                          : "Sélectionner une date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-xl border border-gray-200 bg-white z-50"
                    align="start"
                    sideOffset={4}
                  >
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => setDateTo(date)}
                      initialFocus
                      locale={fr}
                      className="rounded-lg border-0 bg-white"
                      classNames={{
                        day_selected:
                          "bg-[#F8A67E] text-white hover:bg-[#F8A67E] hover:text-white focus:bg-[#F8A67E] focus:text-white",
                        day_today: "bg-gray-100 text-gray-900",
                        day: "hover:bg-gray-100 focus:bg-gray-100",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Product ID */}
              <div className="">
                <Label className="text-sm font-medium text-gray-700">
                  ID Produit
                </Label>
                <Input
                  placeholder="XXXXXXX"
                  value={produitId}
                  onChange={(e) => setProduitId(e.target.value)}
                  className="border-gray-300 focus:border-[#F8A67E] focus:ring-2 focus:ring-[#F8A67E]/20  h-9 bg-white/50 shadow-sm"
                />
              </div>

              {/* Filter Button */}
              <Button
                onClick={fetchAllStats}
                disabled={!dateFrom || !dateTo}
                className="bg-[#F8A67E] hover:bg-[#F8A67E]/90 text-white font-medium px-6 sm:px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed  h-9 "
              >
                Filtrer les Données
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Commandes Card */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 max-h-56 bg-white group hover:scale-[1.02]">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                  Commandes
                </CardTitle>
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 -mt-3.5">
              <div className="text-2xl sm:text-3xl font-bold text-green-500">
                {stats.commande?.percentage ?? 0}%
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Période:</span>
                  <span className="font-medium">
                    {stats.commande?.windowCount ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">
                    {stats.commande?.totalCount ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients Card */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl max-h-56 transition-all duration-300 bg-white group hover:scale-[1.02]">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                  Clients
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.client?.percentage ?? 0}%
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Période:</span>
                  <span className="font-medium">
                    {stats.client?.clientCountWindow ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">
                    {stats.client?.clientCountTotal ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retours Card */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl max-h-56 transition-all duration-300 bg-white group hover:scale-[1.02]">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
                  Retours
                </CardTitle>
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {stats.retour?.percentage ?? 0}%
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Période:</span>
                  <span className="font-medium">
                    {stats.retour?.retourCountWindow ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">
                    {stats.retour?.retourCountTotal ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retours/Commandes Card */}
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl max-h-56 transition-all duration-300 bg-white group hover:scale-[1.02] sm:col-span-2 xl:col-span-1">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 text-balance">
                  Retours / Commandes
                </CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                {stats.retourCommande?.percentage ?? 0}%
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Retours:</span>
                  <span className="font-medium">
                    {stats.retourCommande?.retourCountWindow ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Commandes:</span>
                  <span className="font-medium">
                    {stats.retourCommande?.commandeCountTotal ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
