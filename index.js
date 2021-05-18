// server.js

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-9bgfkzlho.eu.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://learning-express',
    issuer: [`https://dev-9bgfkzlho.eu.auth0.com/`],
    algorithms: ['RS256']
});

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
    res.json({
        message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
    });
});

// This route needs authentication
app.get('/api/private', checkJwt, function(req, res) {
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated to see this.'
    });
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({ error: error.toString() });
});

const port = 3001;

app.listen(port, function () {
    console.log(`Orders app listening on port ${port}!`);
});
