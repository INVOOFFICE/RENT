import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function img(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : '/' + path;
  return `${base}${clean}`;
}
