const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PgSession = require('connect-pg-simple')(session);

const app = express();
const port = 3000;

// Amazon RDS hosted database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // for self-signed certificates
    }
});

app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', // Adjust as needed for your setup
        domain: 'localhost' // Set this to your domain
    }
}));



app.use(cors({
    origin: 'http://localhost:3001', // Ensure this matches your frontend URL
    credentials: true
}));

app.use(express.json());

function ensureAuthenticated(req, res, next) {
    console.log('ensureAuthenticated middleware called');
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    if (req.session.user) {
        console.log('User is authenticated');
        return next();
    }
    console.log('User is not authenticated');
    res.status(401).send('Unauthorized');
}


app.get('/api/items', async (req, res) => {
    
    const searchTerm = req.query.q;
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT id, name, highalch, lowalch, item_limit
            FROM osrs_items
            WHERE name ILIKE $1
        `;
        const result = await client.query(queryText, [`%${searchTerm}%`]);
        client.release();
        
        res.json(result.rows);
    } catch (err) {
        
        res.status(500).send('Internal Server Error');
    }
});




// Function saving user info to db
async function saveUser(email, oauthProvider, oauthId) {
    const client = await pool.connect();
    
    try {
        const queryText = 'INSERT INTO users(email, oauth_provider, oauth_id) VALUES($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *';
        const res = await client.query(queryText, [email, oauthProvider, oauthId]);
       

        if (res.rows.length > 0) {
            // User was inserted, return the new user
            return res.rows[0];
        } else {
            // User already exists, fetch the existing user
            const fetchUserQuery = 'SELECT * FROM users WHERE email = $1';
            const fetchUserResult = await client.query(fetchUserQuery, [email]);
            
            return fetchUserResult.rows[0];
        }
    } catch (err) {
        
        throw err; // Rethrow the error to handle it in the catch block of the calling function
    } finally {
        client.release();
    }
}


// Endpoint to handle saving user info after Firebase authentication
app.post('/auth/google/callback', async (req, res) => {
    const { email, oauthProvider, oauthId } = req.body;
    try {
        const user = await saveUser(email, oauthProvider, oauthId);
        if (user) {
            req.session.user = { id: user.id, email, oauthProvider, oauthId };
            req.session.save(err => {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).json({ id: user.id }); // Returning user ID for setting in frontend
                }
            });
        } else {
            res.status(200).send('User already exists');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint to fetch user data from session
app.get('/api/user', ensureAuthenticated, (req, res) => {
    
    
    res.json(req.session.user);
});



// Other routes...
app.get('/api/user', ensureAuthenticated, (req, res) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).send('Unauthorized');
    }
  });
  
  app.post('/auth/google/callback', async (req, res) => {
    const { email, oauthProvider, oauthId } = req.body;
    try {
      const user = await saveUser(email, oauthProvider, oauthId);
      if (user) {
        req.session.user = { id: user.id, email, oauthProvider, oauthId };
        req.session.save(err => {
          if (err) {
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).json(req.session.user); // Returning user data for setting in frontend
          }
        });
      } else {
        res.status(200).send('User already exists');
      }
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.get('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);
      client.release();
      res.json(result.rows);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.post('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const { itemId, itemName } = req.body;
    // console.log('Received request to add to watchlist:', { userId, itemId, itemName });

    try {
        const client = await pool.connect();
        console.log('Connected to the database');

        // Insert the item into the watchlist table
        const query = 'INSERT INTO watchlist (user_id, item_id, item_name) VALUES ($1, $2, $3)';
        const values = [userId, itemId, itemName];
        const result = await client.query(query, values);

        // console.log('Query result:', result); // Log the result of the query
        client.release();
        // console.log('Item added to watchlist');
        res.status(201).send('Item added to watchlist');
    } catch (err) {
        console.error('Error adding to watchlist:', err);
        res.status(500).send('Internal Server Error');
    }
});

  
  app.delete('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM watchlist WHERE user_id = $1 AND item_id = $2', [userId, itemId]);
      client.release();
      res.status(200).send('Item removed from watchlist');
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
