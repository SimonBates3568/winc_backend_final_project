import express from "express";
import * as Sentry from "@sentry/node";
import "dotenv/config";
import usersRouter from "./routes/users.js";
import bookingsRouter from "./routes/bookings.js";
import propertiesRouter from "./routes/properties.js";
import reviewsRouter from "./routes/reviews.js";
import hostsRouter from "./routes/hosts.js";
import amenitiesRouter from "./routes/amenities.js";
import loginRouter from "./routes/login.js";
import log from "./middleware/logMiddleware.js";


const app = express();

// Welcome message for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API!',
    version: '1.0.0',
    status: 'Server is running successfully'
  });
});

// Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
});

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Global middleware
app.use(express.json());
app.use(log);

// Login (public route)
app.use("/login", loginRouter);

// Resource routes
app.use("/users", usersRouter);
app.use("/bookings", bookingsRouter);
app.use("/properties", propertiesRouter);
app.use("/reviews", reviewsRouter);
app.use("/hosts", hostsRouter);
app.use("/amenities", amenitiesRouter);

// Debug route for Sentry
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

// Trace errors
app.use(Sentry.Handlers.errorHandler());

// Simple error handling (replace the auth middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});