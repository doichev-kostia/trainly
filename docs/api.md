# API design guide

Use REST-like architecture and resource-oriented design.

## Resources

There are 2 types of resources:

- single resource
- collection resource

A single resource is a resource that has some state and zero or more sub-resources.
A collection contains a list of resources of the **same type**.

For example:
The API has a collection of customers. Each customer has one or more bookings.

While the API is based on resources, the service with a resource-oriented design is not necessarily a database.
So, the database entities != API resources.
For instance, creating a checkout, will not only create a booking, but also create tickets, initialize a checkout
session, send emails, etc.

## Naming

The resources are hierarchically organized using collections and single resources.
Each resource has a unique identifier.

The resource path is typically consists of multiple URI segments that identify the resource within its parent collection

Each collection name should follow the specified requirements:

- use the plural form. If the term doesn't have suitable plural form, such as "evidence" and "weather", the singular
  form should be used.
- use lower kebab-case (e.g. `some-resource-name`)
-

## Methods

### Standard methods

| Method   | HTTP verb   | HTTP request body | HTTP response body |
|----------|-------------|-------------------|--------------------|
| List     | GET         | N/A               | Resource* list     |
| Retrieve | GET         | N/A               | Resource*          |
| Create   | POST        | Resource          | Resource*          |
| Update   | PATCH / PUT | Resource          | Resource*          |
| Delete   | DELETE      | N/A               | Empty              |

`*` The resource returned can be partial, depending on the fields requested.

##### List

Takes zero or more parameters as input and returns the list of resources that match the input.

[//]: # (TODO: search, filter, sort, pagination)

##### Retrieve

Takes the resource identifier, zero or more parameters and returns the specified resource.

##### Create

Takes the parent resource identifier, a resource, zero or more parameters and returns the created resource.

If the create method accepts the user defined identifier and this identifier already exists, the method should return a
409 HTTP status code and an error with code `ALREADY_EXISTS`.

##### Update

The update method takes a resource and zero or more parameters and returns the updated resource.
This method should not modify the resource or its parent identifier. For those operations, use the `Move` functionality
defined by the custom methods.

- If the update method supports the partial update, use the `PATCH` HTTP verb.
- If the update only supports the full resource update, use the `PUT` HTTP verb.

If the specified resource doesn't exist, the method should return a 404 HTTP status code and an error with
code `NOT_FOUND`.

##### Delete

The delete method takes the resource identifier and zero or more parameters and deletes or schedules for deletion the
specified resource. The method should return an empty response.

If the specified resource doesn't exist, the method should return a 404 HTTP status code and an error with
code `NOT_FOUND`.

### Custom methods

For custom methods, use the following convention:

```
/some/resource/name:custom_method
```

Guidelines:

- The custom method should use the HTTP `POST` verb
- The custom method should be defined after the semicolon (`:`)
- The custom method should be written using the snake_case convention

common custom methods:

- move
- search
- copy
- cancel
- send
- enable
- disable

## Standard fields

The following is the list of standard field names that should be used if applicable:

| name        | type      | description                                             |
|-------------|-----------|---------------------------------------------------------|
| id          | string    | The resource identifier, usually uuid                   |
| create_time | timestamp | The resource creation timestamp                         |
| update_time | timestamp | The resource last update timestamp                      |
| delete_time | timestamp | The resource deletion timestamp                         |
| expire_time | timestamp | The resource expiration timestamp                       |
| start_time  | timestamp | The resource start timestamp                            |
| end_time    | timestamp | The resource end timestamp                              |
| title       | string    | The official name of an entity, such as company name    |
| description | string    | One or more paragraphs of text description of an entity |

## Errors 

[//]: # (TODO: create a guideline)


## API versioning

Use major versioning in the URL. For example:

```
https://api.example.com/v1/some/resource
```

Each directory in the routes should contain a major version number. For example:

```
routes/v1/some/resource
```

## API schemas

Use @effect/schema to define the API schemas. Common schemas should be defined in the `schemas` directory.
service-specific schemas should be defined in the `schemas` directory of the service.
`routes/v1/customers/schemas.ts`
