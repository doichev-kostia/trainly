# Domain


## Features

- scheduling
- create journeys upfront
- audit trail

- delay can be added only for the whole journey
- the journey train can't be changed
- all the dates are in UTC
- every train has carriage capacity and seats are equally spread
- all the train seats are sequential
- the number of the "premium" seats is a product of "premium_carriages" and "carriage_capacity"
- when the customer selects a seat it becomes reserved for 15 minutes which is also indicated in the booking entity, if the booking is not proceeded within 15 minutes the seat becomes available again
- we do not evaluate interconnections
- prices are managed via Stripe
- every route has a stripe price id attached to the seat class
