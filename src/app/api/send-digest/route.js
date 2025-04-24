export async function GET(request) {
  const data = {
    message: "Hello from the working API route!",
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
