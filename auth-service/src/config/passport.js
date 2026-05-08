const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const db = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails[0].value;

        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, result) => {

            if (err) {
              return done(err, null);
            }

            // USER BELUM ADA
            if (result.length === 0) {

              db.query(
                "INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)",
                [name, email, googleId],
                (err, insertResult) => {

                  if (err) return done(err, null);

                  const token = jwt.sign(
                    {
                      id: insertResult.insertId,
                      role: 'user'
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                  );

                  return done(null, { token });
                }
              );

            } else {

              const user = result[0];

              // REACTIVATE USER
              if (user.deleted_at !== null) {

                db.query(
                  "UPDATE users SET deleted_at = NULL WHERE email = ?",
                  [email],
                  (err) => {

                    if (err) return done(err, null);

                    const token = jwt.sign(
                      {
                        id: user.id,
                        role: user.role
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '1h' }
                    );

                    return done(null, { token });
                  }
                );

              } else {

                // USER AKTIF
                const token = jwt.sign(
                  {
                    id: user.id,
                    role: user.role
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: '1h' }
                );

                return done(null, { token });
              }
            }
          }
        );

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});