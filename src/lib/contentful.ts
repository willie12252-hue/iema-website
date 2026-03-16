// src/lib/contentful.ts
// This file is DEPRECATED in favor of src/lib/supabase.ts
// However, to prevent build errors before full refactor, we keep dummy exports
// that return empty arrays or mimic the interface so existing components don't crash.

export const getImageUrl = (): string => '';
export const getHeroBanners = async () => [];
export const getFaculty = async () => [];
export const getCourses = async () => [];
export const getActivities = async () => [];
