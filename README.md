![home-3ec0b8a0](https://github.com/user-attachments/assets/577cb1d5-3efd-40fd-bef0-343d88b64c1d)

<h1>Gatherly Backend</h1><p> <strong>Gatherly</strong> is a forum application designed to foster engaging discussions through posts and comments. Users can express their opinions by upvoting or downvoting posts, while moderation features ensure a controlled and respectful environment. This repository contains the backend implementation of Gatherly, built with modern technologies to ensure scalability, security, and performance. </p>
🚀 Key Features
<br>
<br>
👤 User Management
<ul> <li><strong>Sign Up</strong>: Users can create an account to participate in the forum.</li> <li><strong>Sign In</strong>: Registered users can log in to access their accounts.</li> <li><strong>Logout</strong>: Users can securely log out of their accounts.</li> <li><strong>Update</strong>: Users can update their username, avatar and change password</li></ul>
📝 Post Management
<ul> <li><strong>Create Post</strong>: Users can create new posts to start discussions.</li> <li><strong>Update Post</strong>: Authors can edit their posts to update content.</li> <li><strong>Delete Post</strong>: Authors can remove their posts from the forum.</li> </ul>
⬆️⬇️ Voting System
<ul> <li><strong>Upvote Post</strong>: Users can upvote posts they find valuable or interesting.</li> <li><strong>Downvote Post</strong>: Users can downvote posts they disagree with or find unhelpful.</li> </ul>
💬 Comment Management
<ul> <li><strong>Add Comment</strong>: Users can comment on posts to share their thoughts.</li> <li><strong>Delete Comment</strong>: Users can remove their comments if needed.</li> </ul>
🛡️ Moderation Features
<ul> <li><strong>Post Bans</strong>: <ul> <li>Ban a user from adding comments to a specific post.</li> <li>Ban a user from viewing a specific post.</li> <li>Ban a user from upvoting or downvoting a specific post.</li> </ul> </li> </ul>
🛠️ Technologies Used
Core Stack
<ul> <li><strong>TypeScript</strong>: Primary programming language for type-safe development.</li> <li><strong>NestJS</strong>: A progressive Node.js framework for building efficient and scalable server-side applications.</li> <li><strong>Prisma</strong>: Modern ORM for database management and migrations.</li> <li><strong>JWT (JSON Web Tokens)</strong>: Used for secure user authentication and authorization.</li> <li><strong>Nodemailer</strong>: Handles email notifications (e.g., account verification, password reset).</li> </ul>
Database & Caching
<ul> <li><strong>MySQL</strong>: Relational database for storing user data, posts, comments, and votes.</li> <li><strong>Redis</strong>: Used for managing background tasks.</li> </ul>
Background Jobs & Queue Management
<ul> <li><strong>BullMQ</strong>: Handles background jobs and task queues (e.g., email notifications, async processing).</li> </ul>
Validation & Schema Management
<ul> <li><strong>Zod</strong>: Used for runtime validation and schema definition.</li> </ul>
Testing
<ul> <li><strong>Jest</strong>: Testing framework for unit tests.</li> </ul>
Cloud & Infrastructure
<ul> <li><strong>AWS</strong>: <ul> <li><strong>S3</strong>: Stores media files (e.g., images uploaded by users).</li> <li><strong>IAM</strong>: Manages access control for AWS resources.</li> <li><strong>EC2</strong>: Hosts the application in a scalable environment.</li> <li><strong>Lambda</strong>: Handles serverless functions for specific tasks.</li> </ul> </li> </ul>

<h2>🚧 <strong>Project Status</strong></h2> <p> The Gatherly <strong>Frontend</strong> and <strong>Backend</strong> are currently under active development. New features, improvements, and bug fixes are being implemented regularly.</p>
