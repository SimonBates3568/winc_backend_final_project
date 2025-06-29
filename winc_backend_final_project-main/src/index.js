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
import errorHandler from "./middleware/errorHandler.js";


const app = express();

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

// Health check route
app.get('/', (_, res) => {
  res.send('API is running');
});

// Global middleware
app.use(express.json());
app.use(log);
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

//Resource routes
app.use("/users", usersRouter);
app.use("/bookings", bookingsRouter);
app.use("/properties", propertiesRouter);
app.use("/reviews", reviewsRouter);
app.use("/hosts", hostsRouter);
app.use("/amenities", amenitiesRouter);

// Debug route for Sentry
app.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

// Login
app.use("/login", loginRouter);

// Trace errors
// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

app.listen(4000, '0.0.0.0', () => {
  console.log("Server is listening on port 4000");
});











