const result = await fetch('http://localhost:8000/api/auth/register/recruiter/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: "mateyct2",
    password: "supersecure",
    email: "fake@example.com",
    description: "I am a recruiter",
  })
})

const data = await result.text();
console.log(data);