![home-3ec0b8a0](https://github.com/user-attachments/assets/577cb1d5-3efd-40fd-bef0-343d88b64c1d)

Gatherly Backend
Gatherly is a robust forum application designed to empower users to engage in discussions through posts and comments. Users can express their opinions by upvoting or downvoting posts, while advanced moderation features allow for post-specific bans, ensuring a controlled and respectful environment.

Key Use Cases
User Management
Sign Up: Users can create an account to participate in the forum.

Sign In: Registered users can log in to access their accounts.

Logout: Users can securely log out of their accounts.

Post Management
Create Post: Users can create new posts to start discussions.

Update Post: Authors can edit their posts to update content.

Delete Post: Authors can remove their posts from the forum.

Voting System
Upvote Post: Users can upvote posts they find valuable or interesting.

Downvote Post: Users can downvote posts they disagree with or find unhelpful.

Comment Management
Add Comment: Users can comment on posts to share their thoughts.

Delete Comment: Users can remove their comments if needed.

Moderation Features
Post Bans:

Ban a user from adding comments to a specific post.

Ban a user from viewing a specific post.

Ban a user from upvoting or downvoting a specific post.

Technologies Used
Core Stack
TypeScript: Primary programming language for type-safe development.

NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.

Prisma: Modern ORM for database management and migrations.

JWT (JSON Web Tokens): Used for secure user authentication and authorization.

Nodemailer: Handles email notifications (e.g., account verification, password reset).

Database & Caching
MySQL: Relational database for storing user data, posts, comments, and votes.

Redis: Used for caching frequently accessed data and managing background tasks.

Background Jobs & Queue Management
BullMQ: Handles background jobs and task queues (e.g., email notifications, async processing).

Validation & Schema Management
Zod: Used for runtime validation and schema definition.

Testing
Jest: Testing framework for unit and integration tests.

Cloud & Infrastructure
AWS:

S3: Stores media files (e.g., images uploaded by users).

IAM: Manages access control for AWS resources.

EC2: Hosts the application in a scalable environment.

Lambda: Handles serverless functions for specific tasks.
