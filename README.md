![home-3ec0b8a0](https://github.com/user-attachments/assets/577cb1d5-3efd-40fd-bef0-343d88b64c1d)

<h1 align="justify">Gatherly Backend</h1><p align="center"> <strong>Gatherly</strong> is a feature-rich forum application designed to foster engaging discussions through posts and comments. Users can express their opinions by upvoting or downvoting posts, while advanced moderation features ensure a controlled and respectful environment. This repository contains the backend implementation of Gatherly, built with modern technologies to ensure scalability, security, and performance. </p>
🚀 Key Features
<br>
<br>
👤 User Management
<ul> <li><strong>Sign Up</strong>: Users can create an account to participate in the forum.</li> <li><strong>Sign In</strong>: Registered users can log in to access their accounts.</li> <li><strong>Logout</strong>: Users can securely log out of their accounts.</li> </ul>
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
<ul> <li><strong>MySQL</strong>: Relational database for storing user data, posts, comments, and votes.</li> <li><strong>Redis</strong>: Used for caching frequently accessed data and managing background tasks.</li> </ul>
Background Jobs & Queue Management
<ul> <li><strong>BullMQ</strong>: Handles background jobs and task queues (e.g., email notifications, async processing).</li> </ul>
Validation & Schema Management
<ul> <li><strong>Zod</strong>: Used for runtime validation and schema definition.</li> </ul>
Testing
<ul> <li><strong>Jest</strong>: Testing framework for unit and integration tests.</li> </ul>
Cloud & Infrastructure
<ul> <li><strong>AWS</strong>: <ul> <li><strong>S3</strong>: Stores media files (e.g., images uploaded by users).</li> <li><strong>IAM</strong>: Manages access control for AWS resources.</li> <li><strong>EC2</strong>: Hosts the application in a scalable environment.</li> <li><strong>Lambda</strong>: Handles serverless functions for specific tasks.</li> </ul> </li> </ul>


How to Run the App
Follow these steps to set up and run the Gatherly backend locally using Docker Compose for MySQL and Redis.

<h3>📋 <strong>Prerequisites</strong></h3> <p>Before you begin, ensure you have the following installed on your local machine:</p> <ul> <li><a href="https://nodejs.org/" target="_blank">Node.js</a> (v16 or higher recommended)</li> <li><a href="https://www.npmjs.com/" target="_blank">npm</a> or <a href="https://yarnpkg.com/" target="_blank">Yarn</a></li> <li><a href="https://www.docker.com/get-started/" target="_blank">Docker</a></li> <li><a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a></li> </ul>
<h3>🔧 <strong>Step 1: Clone the Repository</strong></h3> <p>Clone the Gatherly backend repository to your local machine:</p> <pre><code>git clone https://github.com/your-username/gatherly-backend.git cd gatherly-backend </code></pre>
<h3>📦 <strong>Step 2: Install Dependencies</strong></h3> <p>Install the required dependencies using npm or Yarn:</p> <pre><code>npm install # or yarn install </code></pre>
<h3>⚙️ <strong>Step 3: Set Up Environment Variables</strong></h3> <p>Create a <code>.env</code> file in the root of your project and add the necessary environment variables. You can use the <code>.env.example</code> file as a template:</p> <pre><code>cp .env.example .env </code></pre> <p>Edit the <code>.env</code> file to include your specific configuration, such as database credentials and Redis settings. For example:</p> <pre><code># Database Configuration DB_HOST=localhost DB_PORT=3306 DB_USERNAME=root DB_PASSWORD=yourpassword DB_DATABASE=gatherly
Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
</code></pre>

<h3>🐳 <strong>Step 4: Start Docker Containers</strong></h3> <p>Use Docker Compose to start the MySQL and Redis containers:</p> <pre><code>docker-compose up -d </code></pre> <p>This command will start the MySQL and Redis services in detached mode.</p>
<h3>📂 <strong>Step 5: Run Database Migrations</strong></h3> <p>If your application uses database migrations, run them to set up the database schema:</p> <pre><code>npm run migration:run # or yarn migration:run </code></pre>
<h3>🚀 <strong>Step 6: Start the Application</strong></h3> <p>Start the NestJS application in development mode:</p> <pre><code>npm run start:dev # or yarn start:dev </code></pre> <p>The application should now be running on <code>http://localhost:3000</code>.</p>
<h3>🌐 <strong>Step 7: Access the Application</strong></h3> <p>You can access the application by navigating to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> in your web browser.</p>
<h3>🛑 <strong>Stopping the Application</strong></h3> <p>To stop the application and the Docker containers, use the following commands:</p> <pre><code># Stop the NestJS application (if running in the terminal) Ctrl + C
Stop and remove the Docker containers
docker-compose down
</code></pre>
