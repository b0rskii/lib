export function debounce<T extends (...args: any) => any>(callback: T, delay: number) { 
  let timeout: NodeJS.Timeout | null; 
 
  return function(...args: Parameters<T>) { 
    if (timeout) clearTimeout(timeout); 
 
    setTimeout(() => { 
      timeout = null; 
      callback(...args); 
    }, delay); 
  } 
}
