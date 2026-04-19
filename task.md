Endorsement

POST
​/api​/Endorsement

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "profileSkillId": 0
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
​/api​/Endorsement​/{id}

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
​/api​/Endorsement​/{id}

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
    "endorserId": 0,
    "profileSkillId": 0,
    "createdAt": "2026-04-19T11:01:41.628Z"
  }
}
No links
GET
​/api​/Endorsement​/by-profile-skill​/{profileSkillId}

Parameters
Try it out
Name	Description
profileSkillId *
integer($int32)
(path)
profileSkillId
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
      "endorserId": 0,
      "profileSkillId": 0,
      "createdAt": "2026-04-19T11:01:41.633Z"
    }
  ]
}
No links
GET
​/api​/Endorsement​/by-user​/{userId}

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
      "endorserId": 0,
      "profileSkillId": 0,
      "createdAt": "2026-04-19T11:01:41.640Z"
    }
  ]
}




Language
POST
​/api​/Language

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "string",
  "type": "Natural"
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
​/api​/Language

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
      "name": "string",
      "type": "Natural"
    }
  ]
}
No links
GET
​/api​/Language​/{id}

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
    "name": "string",
    "type": "Natural"
  }
}
No links
PUT
​/api​/Language​/{id}

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
  "name": "string",
  "type": "Natural"
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
​/api​/Language​/{id}

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
​/api​/Language​/search

Parameters
Try it out
Name	Description
name
string
(query)
name
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
      "name": "string",
      "type": "Natural"
    }
  ]
}









ProfileSkill

POST
​/api​/ProfileSkill

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "profileId": 0,
  "skillId": 0,
  "endorsementsCount": 0
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
  "data": {
    "id": 0,
    "profileId": 0,
    "skillId": 0,
    "endorsementsCount": 0
  }
}
No links
GET
​/api​/ProfileSkill

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
      "profileId": 0,
      "skillId": 0,
      "endorsementsCount": 0
    }
  ]
}
No links
GET
​/api​/ProfileSkill​/{id}

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
    "profileId": 0,
    "skillId": 0,
    "endorsementsCount": 0
  }
}
No links
PUT
​/api​/ProfileSkill​/{id}

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
  "skillId": 0,
  "endorsementsCount": 0
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
  "data": {
    "id": 0,
    "profileId": 0,
    "skillId": 0,
    "endorsementsCount": 0
  }
}
No links
DELETE
​/api​/ProfileSkill​/{id}

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
​/api​/ProfileSkill​/by-profile​/{profileId}

Parameters
Try it out
Name	Description
profileId *
integer($int32)
(path)
profileId
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
      "profileId": 0,
      "skillId": 0,
      "endorsementsCount": 0
    }
  ]
}
No links
DELETE
​/api​/ProfileSkill​/profile​/{profileId}​/skill​/{skillId}

Parameters
Try it out
Name	Description
profileId *
integer($int32)
(path)
profileId
skillId *
integer($int32)
(path)
skillId
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















Recommendation

POST
​/api​/Recommendation

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "recipientId": 0,
  "content": "string"
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
​/api​/Recommendation​/{id}

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
​/api​/Recommendation​/{id}

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
    "authorId": 0,
    "recipientId": 0,
    "content": "string",
    "createdAt": "2026-04-19T11:05:31.924Z"
  }
}
No links
GET
​/api​/Recommendation​/by-recipient​/{recipientId}

Parameters
Try it out
Name	Description
recipientId *
integer($int32)
(path)
recipientId
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
      "authorId": 0,
      "recipientId": 0,
      "content": "string",
      "createdAt": "2026-04-19T11:05:31.929Z"
    }
  ]
}