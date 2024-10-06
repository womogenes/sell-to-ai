import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Typed from 'typed.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function typed(
  el: any,
  s: string,
  options: any = {},
  delay: number = 0,
) {
  return new Promise(async (resolve) => {
    await new Promise((r) => setTimeout(r, delay));
    if (!s) return;
    new Typed(el, {
      strings: [s ?? ''],
      showCursor: false,
      ...options,
      onComplete: async () => {
        options?.onComplete?.();
        resolve(null);
      },
    });
  });
}
