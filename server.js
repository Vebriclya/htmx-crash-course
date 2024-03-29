import express from "express";
import axios from "axios";

const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms) - this is what allows you to get fahrenhiet. This is your middleware
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request to fetch users
app.get("/users", async (req, res) => {
  /*   const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Bob Williams" },
    { id: 3, name: "Shannon Jackson" },
  ]; */

  /* The surrounding setTimeout can be removed entirely, it's just to mimic a slow server! */
  setTimeout(async () => {
    const limit = +req.query.limit || 10;

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
    );
    const users = await response.json();

    res.send(`
     <h1 class="text-2xl font-bold my-4">Users</h1>
     <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join("")}
     </ul>
    `);
  }, 2000);
});

// Handle POST request for temp conversion
app.post("/convert", (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celcius = (fahrenheit - 32) * (5 / 9);

    res.send(`
    <p>
        ${fahrenheit} degrees Fahrenheit is equal to ${celcius.toFixed(
      2
    )} degrees Celcius
    </p>
    `);
  }, 2000);
});

// Handle GET request for polling example
let counter = 0;

app.get("/poll", (req, res) => {
  counter++;

  const data = { value: counter };
  res.json(data);
});

// Handle GET request for weather
const apiKey = "5a27d69e27f140f58e7141821230211";
const location = "Felixstowe";
app.get("/get-temperature", async (req, res) => {
  try {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}`;
    const response = await axios.get(apiUrl);

    // Extract temperature information from the response
    const temperatureCelsius = response.data.current.temp_c;

    res.send(
      `The current temperature in ${location} is ${temperatureCelsius}°C`
    );
  } catch (error) {
    console.error("Error fetching temperature:", error.message);
    res.status(500).json({ error: "Failed to fetch temperature" });
  }
});

// Handle POST request for contact search
const contacts = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
  { name: "Alice Smith", email: "alice@example.com" },
  { name: "Bob Williams", email: "bob@example.com" },
  { name: "Mary Harris", email: "mary@example.com" },
  { name: "David Mitchell", email: "david@example.com" },
];

app.post("/search", (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
    <tr>
    <td><div class="my-4 p-2">${contact.name}</div></td>
    <td><div class="my-4 p-2">${contact.email}</div></td>
    </tr>`
      )
      .join("");

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for contacts search from jsonplaceholder
app.post("/search/api", async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
      <tr>
      <td><div class="my-4 p-2">${contact.name}</div></td>
      <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>`
      )
      .join("");

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for email validation
app.post("/contact/email", (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: "That email is valid",
    class: "text-green-700",
  };
  const isInvalid = {
    message: "Please enter a valid email",
    class: "text-red-700",
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
        <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
          >Email Address</label
        >
        <input
          type="email"
          hx-post="/contact/email"
          id="email"
          value="${submittedEmail}"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          required
        />
        <div class="${isInvalid.class}">${isInvalid.message}</div>
      </div>

        `
    );
  } else {
    return res.send(
      `
          <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            type="email"
            hx-post="/contact/email"
            id="email"
            value="${submittedEmail}"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            required
          />
          <div class="${isValid.class}">${isValid.message}</div>
        </div>
  
          `
    );
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
