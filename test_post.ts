import { POST } from "./src/app/api/auth/login/route";

async function testApi() {
  console.log("=== PROBANDO API POST /api/auth/login ===");

  const req = new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "superadmin",
      password: "superadmin123",
    }),
  });

  const res = await POST(req);
  const data = await res.json();

  console.log("Status Code:", res.status);
  console.log("Response Data:", data);
}

testApi().catch(console.error);
