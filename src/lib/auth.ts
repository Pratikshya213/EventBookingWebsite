import api from "./axios";

//Register
export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmpassword: string,
) {
  try {
    //check whether the email already exists or not
    const existingUsers = await api.get(
      `/users?email=${encodeURIComponent(email)}`,
    );

    if (existingUsers.data.length > 0) {
      throw new Error("User already exists.");
    }
    //save the new user
    const response = await api.post("/users", {
      name,
      email,
      password,
      confirmpassword,
    });
    return response.data;
  } catch (error) {
    console.error("Registration Failed!");
    throw error;
  }
}

//Login
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.get(
      `/users?email=${encodeURIComponent(email.trim())}`,
    );

    const user = response.data.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() == email.trim().toLowerCase() &&
        user.password == password,
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    //exclude password fields from the rest of the returned user object
    const {
      password: _password,
      confirmPassword: _confirmPassword,
      ...userInfo
    } = user;

    return userInfo;
  } catch (error) {
    console.error("Login Failed!");
    throw error;
  }
}
