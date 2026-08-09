import { POST } from "./src/app/api/superadmin/tenants/route";

async function testCreateStore() {
  console.log("=== PROBANDO ALTA DE COMERCIO EMPORIO DEL SABOR ===");

  const req = new Request("http://localhost:3000/api/superadmin/tenants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Emporio Del Sabor",
      slug: "emporio-del-sabor",
      plan: "PRO",
      monthlyFee: 25000,
      adminName: "Abril Perez",
      adminUsername: "abrilperez",
      adminPassword: "primercliente",
    }),
  });

  const res = await POST(req);
  const data = await res.json();

  console.log("Status Code:", res.status);
  console.log("Response Data:", JSON.stringify(data, null, 2));
}

testCreateStore().catch(console.error);
