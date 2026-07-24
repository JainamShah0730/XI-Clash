const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "xiclash_token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// A fetch wrapper that automatically attaches the Authorization header
// when a token is stored, so every other component doesn't have to remember to.
export async function authFetch(path, options = {}) {
    const token = getToken();
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
}

export async function register(username, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    setToken(data.token);
    return data.user;
}

export async function login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setToken(data.token);
    return data.user;
}

export async function fetchCurrentUser() {
    const token = getToken();
    if (!token) return null;
    try {
        const res = await authFetch("/auth/me");
        if (!res.ok) { clearToken(); return null; }
        const data = await res.json();
        return data.user;
    } catch {
        return null;
    }
}