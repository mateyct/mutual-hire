const result = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: "mateyct",
    password: "supersecure",
  })
})

const data = await result.text();
console.log(data);