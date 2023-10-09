# Architecture

- separate API
- Postgres DB for the API
- BFF (Backend for Frontend)
- Sqlite DB for the BFF

The API has no role/user management. It is only used to store and retrieve data regarding railroads, customers and
bookings.

The BFF is used for user authentication, authorization and role management.
It is also used to store and retrieve data regarding specific users and their bookings.
For authentication, the SvelteKit back end will send requests to different oauth providers and will create users, roles
and tokens in the Sqlite DB.
