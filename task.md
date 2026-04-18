POST
​/api​/UserExperience

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "userId": 0,
  "companyName": "string",
  "position": "string",
  "startDate": "2026-04-18T13:36:43.785Z",
  "endDate": "2026-04-18T13:36:43.785Z"
}
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": "string"
}
No links
GET
​/api​/UserExperience

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": [
    {
      "id": 0,
      "userId": 0,
      "companyName": "string",
      "position": "string",
      "startDate": "2026-04-18T13:36:43.793Z",
      "endDate": "2026-04-18T13:36:43.793Z"
    }
  ]
}
No links
GET
​/api​/UserExperience​/{id}

Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": {
    "id": 0,
    "userId": 0,
    "companyName": "string",
    "position": "string",
    "startDate": "2026-04-18T13:36:43.802Z",
    "endDate": "2026-04-18T13:36:43.802Z"
  }
}
No links
PUT
​/api​/UserExperience​/{id}

Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Request body

application/json
Example Value
Schema
{
  "id": 0,
  "companyName": "string",
  "position": "string",
  "startDate": "2026-04-18T13:36:43.808Z",
  "endDate": "2026-04-18T13:36:43.808Z"
}
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": "string"
}
No links
DELETE
​/api​/UserExperience​/{id}

Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": "string"
}
No links
GET
​/api​/UserExperience​/by-user​/{userId}

Parameters
Try it out
Name	Description
userId *
integer($int32)
(path)
userId
Responses
Code	Description	Links
200	
Success

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "statusCode": 0,
  "description": [
    "string"
  ],
  "data": [
    {
      "id": 0,
      "userId": 0,
      "companyName": "string",
      "position": "string",
      "startDate": "2026-04-18T13:36:43.818Z",
      "endDate": "2026-04-18T13:36:43.818Z"
    }
  ]
}