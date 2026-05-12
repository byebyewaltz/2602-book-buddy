const BASE_URL = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";

// ── Books 
export async function fetchAllBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not fetch books");
  return data.books ?? data;
}

export async function fetchBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not fetch book");
  return data.book ?? data;
}

// ── Auth 
export async function registerUser({ firstname, lastname, email, password }) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function fetchMe(token) {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not fetch user");
  return data.data?.user ?? data.user ?? data;
}

// ── Reservations 
export async function fetchReservations(token) {
  const res = await fetch(`${BASE_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not fetch reservations");
  return data.reservations ?? data;
}

export async function reserveBook(bookId, token) {
  const res = await fetch(`${BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId: Number(bookId) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not reserve book");
  return data;
}

export async function returnBook(reservationId, token) {
  const res = await fetch(`${BASE_URL}/reservations/${reservationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Could not return book";
    try { msg = JSON.parse(text).message || msg; } catch { /* plain-text body */ }
    throw new Error(msg);
  }
}
