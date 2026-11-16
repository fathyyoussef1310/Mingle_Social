# DB Design



##  User

- id
- UserName
- email
- password
- phoneNumber
 - gender
- provider

- createdAt
- isDeleted

### Post
- id
- content
- title
- userId
- createdAt
- isDeleted
- allow comments
- commentsCount
- reactionsCount

# comments
- id
- content
- isDeleted
- postId
- userId
- parentId (replay)
- reactions cont

# reactions

-  id
- refId [ postId , commentId]
- model ["post" , "comments"]
- type ENUM
- updatedAt 