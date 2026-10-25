export type LocalUser = { id: string; name: string; email: string; role: "admin" | "user"; password: string };
const USERS_KEY = "happen-users";
const SESSION_KEY = "happen-session";
const DEMO_USERS: LocalUser[] = [
  { id: "demo-admin-happen", name: "Admin", email: "admin@happen.com", role: "admin", password: "admin1234" },
  { id: "demo-admin", name: "Admin", email: "admin@gmail.com", role: "admin", password: "admin1234" },
  { id: "demo-simran", name: "Simran Bist", email: "simran@gmail.com", role: "user", password: "simran123" },
  { id: "demo-alex", name: "Alex", email: "alex@gmail.com", role: "user", password: "alex1234" },
  { id: "demo-pratikshya", name: "Pratikshya23", email: "pratikshya123@servicehub.com", role: "user", password: "12345678" },
];

function readUsers(): LocalUser[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    return Array.isArray(value) ? value as LocalUser[] : [];
  } catch { return []; }
}

// Register
export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (DEMO_USERS.some((user) => user.email === normalizedEmail) || users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }
  const user = { id: `user-${Date.now()}`, name: name.trim(), email: normalizedEmail, role: "user" as const, password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

// Login
export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = [...DEMO_USERS, ...readUsers()].find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
  if (!user) throw new Error("Incorrect email or password.");
  const session = { id: user.id, name: user.name, email: user.email, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getLocalSession() {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    if (value && typeof value.id === "string") return value as Omit<LocalUser, "password">;
  } catch { /* Ignore invalid browser storage. */ }
  return null;
}

export function clearLocalSession() { localStorage.removeItem(SESSION_KEY); }
