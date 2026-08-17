/**
 * Application constants and configuration values
 * Provides centralized constants used throughout the application
 */

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  GITHUB: {
    BASE: "https://api.github.com",
    USER: "/users/{username}",
    REPOS: "/users/{username}/repos",
    LANGUAGES: "/repos/{owner}/{repo}/languages",
    BRANCHES: "/repos/{owner}/{repo}/branches",
  },
  EMAIL: {
    SEND: "/api/email",
  CONTACT: "/api/contact",
  SENDGRID: "/v3/mail/send",
    RESEND: "/emails",
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
} as const;

/**
 * Cache TTL configurations (in seconds)
 */
export const CACHE_TTL = {
  SHORT: 60,          // 1 minute
  MEDIUM: 300,        // 5 minutes
  LONG: 3600,         // 1 hour
  VERY_LONG: 86400,   // 24 hours
  GITHUB_DATA: 3600,  // GitHub API data
  EMAIL_CACHE: 1800,  // Email verification
} as const;

/**
 * Application timeouts
 */
export const TIMEOUTS = {
  DEFAULT: 10000,      // 10 seconds
  FETCH: 15000,        // 15 seconds
  API: 30000,          // 30 seconds
  UPLOAD: 60000,       // 1 minute
  VALIDATION: 5000,    // 5 seconds
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  GITHUB_DEFAULT_LIMIT: 100,
} as const;

/**
 * Rate limiting configurations
 */
export const RATE_LIMIT = {
  WINDOW_MS: 60000,          // 1 minute
  MAX_REQUESTS: 100,         // 100 requests per window
  GITHUB_API: 60,            // GitHub unauthenticated
  GITHUB_PREMIUM: 5000,      // GitHub authenticated
  EMAIL_SEND: 10,            // Email sends per minute
} as const;

/**
 * File upload configurations
 */
export const UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024,      // 10 MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  FILE_NAME_MAX_LENGTH: 255,
  ALLOWED_EXTENSIONS: [
    "jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx",
  ],
} as const;

/**
 * Email template configurations
 */
export const EMAIL_TEMPLATES = {
  CONTACT: "contact",
  WELCOME: "welcome",
  RESET_PASSWORD: "reset-password",
  VERIFICATION: "verification",
} as const;

/**
 * Environment-specific configurations
 */
export const ENV_CONFIG = {
  DEVELOPMENT: {
    API_URL: "https://kaonang.dev",
    API_TIMEOUT: TIMEOUTS.DEFAULT,
    ENABLE_ANALYTICS: false,
    ENABLE_CACHING: true,
  },
  STAGING: {
    API_URL: "https://staging-api.example.com",
    API_TIMEOUT: TIMEOUTS.FETCH,
    ENABLE_ANALYTICS: true,
    ENABLE_CACHING: true,
  },
  PRODUCTION: {
    API_URL: "https://api.example.com",
    API_TIMEOUT: TIMEOUTS.API,
    ENABLE_ANALYTICS: true,
    ENABLE_CACHING: true,
  },
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNAVAILABLE_ERROR: "UNAVAILABLE_ERROR",
} as const;

/**
 * GitHub configuration
 */
export const GITHUB_CONFIG = {
  DEFAULT_USERNAME: "kaonangsigit",
  REPOS_LIMIT: 100,
  API_VERSION: "v3",
  USER_AGENT: "Portfolio-App/1.0",
  TIMEOUT: 10000,
  RATE_LIMIT_WINDOW: 3600000,  // 1 hour
} as const;

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  GITHUB: "https://github.com/kaonangsigit",
  LINKEDIN: "https://linkedin.com/in/kaonang-sigit-prakoso",
  TWITTER: "https://twitter.com/kaonangsigit",
  INSTAGRAM: "https://instagram.com/kaonangsigit",
} as const;

/**
 * Date/time formats
 */
export const DATE_FORMATS = {
  ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  HUMAN_READABLE: "MMMM D, YYYY h:mm A",
  SHORT_DATE: "MM/DD/YYYY",
  LONG_DATE: "MMMM D, YYYY",
  TIME_24: "HH:mm",
  TIME_12: "hh:mm A",
  RELATIVE: "relative",
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: "theme",
  USER_PREFERENCES: "user-preferences",
  API_CACHE: "api-cache",
  GITHUB_TOKEN: "github-token",
  EMAIL_CACHE: "email-cache",
  SEARCH_HISTORY: "search-history",
  RECENT_ACTIONS: "recent-actions",
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
  Z_INDICES: {
    BACKGROUND: -1,
    DEFAULT: 0,
    DROPDOWN: 10,
    STICKY: 20,
    FIXED: 30,
    OVERLAY: 40,
    MODAL: 50,
    POPUP: 60,
    TOAST: 70,
  },
  TRANSITION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

/**
 * Validation regex patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(?:\w+:\w+@)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?::\d+)?(?:\/.*)?$/,
  SLUG: /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
  GITHUB_USERNAME: /^[a-zA-Z0-9]([\w-]*[a-zA-Z0-9])?$/,
  NAME: /^[a-zA-Z\s]+$/,
  PHONE: /^\+?1?-?\.?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_CACHE: process.env.NEXT_PUBLIC_ENABLE_CACHE !== "false",
  ENABLE_RATE_LIMIT: process.env.NEXT_PUBLIC_ENABLE_RATE_LIMIT !== "false",
  ENABLE_EMAIL_VERIFICATION: process.env.NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION === "true",
  ENABLE_GITHUB_FEATURES: process.env.NEXT_PUBLIC_ENABLE_GITHUB_FEATURES !== "false",
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  AVATAR_SIZE: 128,
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_DIMENSION: 2048,
  EMPTY_ARRAY: [],
  EMPTY_OBJECT: {},
  ZERO: 0,
  FALSE: false,
  TRUE: true,
} as const;