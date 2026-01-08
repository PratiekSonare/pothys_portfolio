// // Fake Admin Credentials (Replace with DB-stored credentials)
// const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync("admin", 10); // Hash the password

// // Route to Login as Admin & Get Token
// app.post("/api/admin/login", (req, res) => {
//   const { username, password } = req.body;

//   // Check if username is correct
//   if (username !== ADMIN_USERNAME) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   // Check if password is correct
//   if (!bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   // Generate JWT Token (Valid for 1 hour)
//   const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

//   res.json({ token });
// });

// const verifyAdmin = (req, res, next) => {
//     const token = req.header("Authorization")?.split(" ")[1]; // Get token from Bearer

//     if (!token) {
//       return res.status(403).json({ message: "Access Denied. No token provided." });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (decoded.role !== "admin") {
//         return res.status(403).json({ message: "Unauthorized" });
//       }
//       next(); // Proceed to the actual API route
//     } catch (error) {
//       res.status(400).json({ message: "Invalid Token" });
//     }
// };

// // Example protected route
// app.get("/api/admin/protected", (req, res) => {
//   res.json({ message: "Welcome to the admin area!" });
// });