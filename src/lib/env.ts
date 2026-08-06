/** Features detrás de esta bandera solo se ven con NEXT_PUBLIC_APP_ENV=local — nunca en producción. */
export const isLocalEnv = process.env.NEXT_PUBLIC_APP_ENV === "local";
