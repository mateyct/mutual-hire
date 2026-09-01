const result = await fetch('http://localhost:8000/api/auth/register/fake/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: "mateyct4",
    password: "supersecure",
    email: "fake@example.com",
    description: "I am an applicant",
  })
})

const data = await result.text();
console.log(data);