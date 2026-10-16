import api from "./axios";

// Register
export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) {
  try {
    const existingUsers = await api.get(
      `/users?email=${encodeURIComponent(email.trim())}`,
    );

    if (existingUsers.data.length > 0) {
      throw new Error("User already exists.");
    }

    const response = await api.post("/users", {
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

// Login
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.get(
      `/users?email=${encodeURIComponent(email.trim())}`,
    );

    const user = response.data.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const {
      password: _password,
      confirmPassword: _confirmPassword,
      ...userInfo
    } = user;

    return userInfo;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
