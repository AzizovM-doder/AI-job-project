POST
​/api​/Ai​/ask

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "prompt": "string"
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
POST
​/api​/Ai​/analyze-cv

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "userId": 0,
  "cvText": "string",
  "cvFileUrl": "string",
  "applyToProfile": true,
  "syncSkills": true
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
    "fullName": "string",
    "firstName": "string",
    "lastName": "string",
    "professionalSummary": "string",
    "experienceYears": 0,
    "skills": [
      "string"
    ],
    "education": [
      "string"
    ],
    "recommendedRoles": [
      "string"
    ],
    "notes": [
      "string"
    ],
    "missingOrWeakSections": [
      "string"
    ],
    "howToImprove": [
      "string"
    ],
    "helpfulResources": [
      "string"
    ],
    "sourceTextPreview": "string"
  }
}
No links
GET
​/api​/Ai​/skill-gap​/{userId}​/{jobId}

Parameters
Try it out
Name	Description
userId *
integer($int32)
(path)
userId
jobId *
integer($int32)
(path)
jobId
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
    "matchScore": 0,
    "fitSummary": "string",
    "strengths": [
      "string"
    ],
    "missingSkills": [
      "string"
    ],
    "nextSteps": [
      "string"
    ]
  }
}
No links
POST
​/api​/Ai​/improve-job

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "jobId": 0,
  "title": "string",
  "description": "string",
  "location": "string",
  "experienceRequired": 0,
  "applyToJob": true
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
    "improvedTitle": "string",
    "improvedDescription": "string",
    "suggestedSkills": [
      "string"
    ],
    "suggestedResponsibilities": [
      "string"
    ],
    "suggestedBenefits": [
      "string"
    ]
  }
}
No links
POST
​/api​/Ai​/draft-cover-letter

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "userId": 0,
  "jobId": 0,
  "tone": "string",
  "extraContext": "string"
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
    "subject": "string",
    "content": "string"
  }
}
No links
POST
​/api​/Ai​/draft-message

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "userId": 0,
  "jobId": 0,
  "recipientName": "string",
  "purpose": "string",
  "tone": "string",
  "extraContext": "string"
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
    "subject": "string",
    "content": "string"
  }
}