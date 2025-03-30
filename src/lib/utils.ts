import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import stringToColor from "string-to-color";
import { CalendarEvent } from "@/types";

type OnlineDoctor={
  socketId:string;
  newUserId:string;
  role:"doctor"
  status:"free"|"occupied"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCalendarLinks(event: CalendarEvent) {
  const { title, description, locationUrl, startDate, endDate } = event;

  // Google Calendar Link
  const googleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(
    locationUrl
  )}&dates=${startDate.replace(/[-:]/g, '').replace('.000Z', 'Z')}/${endDate
    .replace(/[-:]/g, '')
    .replace('.000Z', 'Z')}`;

  // Outlook Calendar Link
  const outlookCalendarLink = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(
    locationUrl
  )}&startdt=${startDate}&enddt=${endDate}`;

  // iCal File Content
  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${locationUrl}
DTSTART:${startDate.replace(/[-:]/g, '').replace('.000Z', 'Z')}
DTEND:${endDate.replace(/[-:]/g, '').replace('.000Z', 'Z')}
END:VEVENT
END:VCALENDAR`;

  // Generate iCal Link
  // const icalFileName = `${title.replace(/\s+/g, '_')}.ics`;
  const icalFileLink = `data:text/calendar;charset=utf-8,${encodeURIComponent(
    icalContent
  )}`;

  return {
    googleCalendarLink,
    outlookCalendarLink,
    icalFileLink,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // numeric month (e.g., '10')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const inputDate = new Date(dateString);
  const now = new Date();

  // Calculate the difference in calendar days
  const daysDifference = Math.round(
    (inputDate.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );

  // Determine relative date (Today, Tomorrow, or Day of the Week)
  let relativeDate: string;
  if (daysDifference < 0) {
    relativeDate = inputDate.toLocaleString("en-US", dateOptions); 
  } else if (daysDifference === 0) {
    relativeDate = "Today";
  } else if (daysDifference === 1) {
    relativeDate = "Tomorrow";
  } else if (daysDifference > 1 && daysDifference <= 7) {
    relativeDate = inputDate.toLocaleString("en-US", { weekday: "long" }); // e.g., "Wednesday"
  } else if (daysDifference > 7) {
    relativeDate = `${daysDifference} days`;
  } else {
    // Fallback if needed
    relativeDate = inputDate.toLocaleString("en-US", dateOptions);
  }

  // Format date and time
  const formattedDateTime: string = inputDate.toLocaleString("en-US", dateTimeOptions);
  const formattedDateDay: string = inputDate.toLocaleString("en-US", dateDayOptions);
  const formattedDate: string = inputDate.toLocaleString("en-US", dateOptions);
  const formattedTime: string = inputDate.toLocaleString("en-US", timeOptions);

  return {
    relativeDate, // e.g., "Today", "Tomorrow", "Wednesday", or "129 days"
    dateTime: formattedDateTime, // e.g., "Dec 31, 2024, 4:31 PM"
    dateDay: formattedDateDay, // e.g., "Tue, 12/31/2024"
    dateOnly: formattedDate, // e.g., "Dec 31, 2024"
    timeOnly: formattedTime, // e.g., "4:31 PM"
  };
};

export const isToday = (dbDate:Date|string) => {
  const inputDate = new Date(dbDate); // Convert the DB date to a Date object
  const today = new Date(); // Get today's date

  // Use Intl.DateTimeFormat to normalize both dates to 'YYYY-MM-DD'
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedInputDate = dateFormatter.format(inputDate);
  const formattedToday = dateFormatter.format(today);

  // Compare the formatted strings
  return formattedInputDate === formattedToday;
};


export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

export function formatNumber(num=0) {
  if (num >= 1000000) {
    // Format numbers 1,000,000 and above as "1m"
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (num >= 100000) {
    // Format numbers 100,000 to 999,999 as "900k"
    return (num / 1000).toFixed(0) + "k";
  } else if (num >= 1000) {
    // Format numbers 1,000 to 99,999 as "1,000"
    return num.toLocaleString();
  } else {
    // Format numbers below 1,000 as they are
    return num.toString();
  }
}

export function getTimeOfDay() {
  "use client"
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Afternoon";
  } else{
    return "Evening";
  } 
}

export const generateTimestamp = (time:Date): string => {
  const now = new Date(time);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${date}${hours}${minutes}${seconds}`;
};

export function extractInitials(name: string): string {
  if (!name) return ""; // Handle empty input
  
  const words: string[] = name.trim().split(" ").filter(word => word.length > 0);
  let initials: string = "";
  
  if (words.length === 1) {
      initials = words[0][0];
  } else {
      initials = words[0][0] + words[1][0];
  }
  
  return initials.toUpperCase();
}

export function nameColor(name:string){
  const color = stringToColor(name);
  return color
}

export function arraysHaveSameDoctors(arr1: OnlineDoctor[], arr2: OnlineDoctor[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort((a, b) => a.newUserId.localeCompare(b.newUserId));
  const sortedArr2 = [...arr2].sort((a, b) => a.newUserId.localeCompare(b.newUserId));
  console.log(sortedArr1,sortedArr2)
  // Iterate and compare each object
  return sortedArr1.every((doctor, index) => {
    const otherDoctor = sortedArr2[index];
    return (
      doctor.socketId=== otherDoctor.socketId&&
      doctor.newUserId === otherDoctor.newUserId &&
      doctor.role === otherDoctor.role &&
      doctor.status === otherDoctor.status
    );
  });
}

export function getOneMonthAgoISO(): string {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return oneMonthAgo.toISOString();
}