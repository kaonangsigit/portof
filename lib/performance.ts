/**
 * Performance optimization utilities
 */

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  callback?: () => void
): void {
  if (!("IntersectionObserver" in window)) {
    // Fallback for older browsers
    imgElement.src = imgElement.dataset.src || "";
    callback?.();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.add("loaded");
        observer.unobserve(img);
        callback?.();
      }
    });
  }, {
    rootMargin: "50px",
  });

  observer.observe(imgElement);
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Request idle callback polyfill
 */
export function scheduleIdleTask(callback: () => void): void {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}

/**
 * Preload resources
 */
export function preloadResource(href: string, type: "script" | "style" | "image" = "script"): void {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = type;
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Prefetch resource
 */
export function prefetchResource(href: string): void {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Batch DOM operations
 */
export class DOMBatcher {
  private tasks: (() => void)[] = [];
  private scheduled = false;

  add(task: () => void): void {
    this.tasks.push(task);
    this.schedule();
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      this.tasks.forEach((task) => task());
      this.tasks = [];
      this.scheduled = false;
    });
  }
}
