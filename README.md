# Apron coding challenge - bookkeeping service

1. `cd server` and run `npm run install`, then `npm run start`
2. `cd ../client` and run `npm run install`, then `npm run dev`
3. visit `[localhost:5173](http://localhost:5173/)`

Users are served/added/modified from the `users.json` file in the mock server. To generate new users, you can run `npm run seed [number of users]`.

If given the time, I would have added unit/integration tests with Jest/RTL and e2e tests with playwright, but the project was already pretty extensive.
