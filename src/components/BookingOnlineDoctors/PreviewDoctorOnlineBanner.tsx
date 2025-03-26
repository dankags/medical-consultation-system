"use client";
import { useSocket } from "@/stores/useSocket";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

type SocketUser = {
  socketId: string;
  newUserId: string;
  role: "doctor" | "user" | "admin";
  status: "free" | "occupied";
};

const PreviewDoctorOnlineBanner = ({ doctorId }: { doctorId: string }) => {
  const { socket } = useSocket();
  const [isDoctorAvailable, setIsDoctorAvailable] = useState<"free"|"occupied">("free");

  useEffect(() => {
    if (!socket) return;
    const handleDoctorOnline = (socketUsers: SocketUser[]) => {
      const doctor=socketUsers.find(
        (user) => user.newUserId === doctorId && user.role === "doctor"
      );
      if (doctor) {
        setIsDoctorAvailable(doctor.status);
        return;
      }
      setIsDoctorAvailable("occupied");
      return;
    };

    socket?.on("getOnlineDoctors", handleDoctorOnline);

    return () => {
      socket?.off("getOnlineDoctors", handleDoctorOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <Badge
      className={cn(
        "rounded-full px-3",
        isDoctorAvailable==="free"
          ? "dark:text-white dark:bg-emerald-500/80 dark:hover:bg-emerald-500/70"
          : "dark:bg-neutral-600/80 dark:text-white"
      )}
    >
      {isDoctorAvailable==="free" ? "Available" : "In session"}
    </Badge>
  );
};

export default PreviewDoctorOnlineBanner;
