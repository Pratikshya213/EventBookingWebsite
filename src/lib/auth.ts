async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(data.error ?? "The request could not be completed.");
  return data;
}

// Register
export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  return postAuth("register", { name: name.trim(), email: email.trim(), password });
}

// Login
export async function loginUser(email: string, password: string) {
  return postAuth<{ id: string; name: string; email: string; role: "admin" | "user" }>(
    "login",
    { email: email.trim(), password },
  );
}
