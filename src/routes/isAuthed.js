import { getMeApi } from "@/api/auth.api";
import { getRoleFromUser } from "@/lib/auth";

function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

export async function isUserAuthed() {
  try {
    const me = await getMeApi();
    const user = me?.user ?? me?.data?.user ?? null;
    if (user) return true;
    return Boolean(getLocalUser());
  } catch {
    return Boolean(getLocalUser());
  }
}

export async function isAdminAuthed() {
  try {
    const me = await getMeApi();
    const user = me?.user ?? me?.data?.user ?? null;
    return getRoleFromUser(user) === "admin";
  } catch {
    return false;
  }
}
