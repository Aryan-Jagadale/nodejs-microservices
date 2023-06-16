const Sentry = require("@sentry/node");


Sentry.init({
  dsn: "https://9215606a6f70418f80da05210109cfc8@o4505146878328832.ingest.sentry.io/4505146885668864",
  tracesSampleRate: 1.0,
});

module.exports = (app) => {
    app.use((error, req, res, next) => {
        let reportError = true;
    
        // skip common / known errors
        [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
          if (error instanceof typeOfError) {
            reportError = false;
          }
        });
    
        if (reportError) {
          Sentry.captureException(error);
        }
        const statusCode = error.statusCode || 500;
        const data = error.data || error.message;
        return res.status(statusCode).json(data);
      });


}