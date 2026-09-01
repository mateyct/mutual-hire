// const result = await fetch('http://localhost:8000/api/auth/register/fake/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     username: "mateyct4",
//     password: "supersecure",
//     email: "fake@example.com",
//     description: "I am an applicant",
//   })
// })

// const result = await fetch('http://localhost:8000/api/auth/login/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     username: "mateyct2",
//     password: "supersecure",
//   })
// })

const result = await fetch('http://localhost:8000/api/job/2', {
  method: 'GET',
  headers: {
    Authorization: 'Token 4078af206b516dfc56e9ef64373410ac34720c82',
    'Content-Type': 'application/json',
  }
})

// const result = await fetch('http://localhost:8000/api/job/', {
//   method: 'POST',
//   headers: {
//     Authorization: 'Token 4078af206b516dfc56e9ef64373410ac34720c82',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     title: 'Software Engineer',
//     location: 'New York, NY',
//     pay: 120000,
//     type: 'full_time',
//     description: 'We are looking for a skilled software engineer to join our team.',
//   })
// })


// const result = await fetch('http://localhost:8000/api/job/2/', {
//   method: 'POST',
//   headers: {
//     Authorization: 'Token 4078af206b516dfc56e9ef64373410ac34720c82',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     title: 'Software Engineer II',
//     pay: 5,
//   })
// })

const data = await result.text();
console.log(data);