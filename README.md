<h1>Productivity Management App</h1>

* This application helps users to manage their tasks effectively by enabling them to organize and categorize tasks into distinct lists, thereby aiding them in staying structured and focused on their objectives.

* The server-side of this application is developed using JavaScript and utilizes Nedb as a lightweight database for storing data. The app uses Koa to handle HTTP requests and JWT to generate and verify authentication tokens, ensuring secure communication between the client and server.

* The client side of the application is built with Ionic React, which utilizes React components for cross-platform app development. TypeScript is used to enhance code quality and Axios to handle requests to the server.



Upon opening the application, we are met with the login page:

<img width="850" alt="Screenshot 2024-02-28 124354" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/d7e60002-97ba-4d1a-9f78-9fa2f8d55fbc">

Here, we can enter our credentials or click on the register button in order to create an account:

<img width="694" alt="Screenshot 2024-02-28 124443" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/4d8d8110-a93f-4704-99c5-df916e940edf">

If an error occurs or validation checks fail, we receive a notification through a message.

After logging in or registering, we are automatically redirected to the home page:

<img width="1280" alt="Screenshot 2024-02-28 124526" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/be9e9170-63a9-4458-ae47-d23b5f42b4c2">

Here, we can select a date from the calendar and view the tasks for that date or create a new task for the selected date:

<img width="454" alt="Screenshot 2024-02-28 124636" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/961ae4a1-80a3-4af5-a237-7b1a11e97877">

After clicking on the "ADD TASK" button, the newly created task will appear in the tasks list:

<img width="1271" alt="Screenshot 2024-02-28 124656" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/c33eedfc-679a-4cce-a74a-39fd6cfba6df">

Every task in the list can be modified:

<img width="1279" alt="Screenshot 2024-02-28 124801" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/929c3d28-7a18-4e96-89fc-5bc568aea223">

Once marked as done, the task will be visually crossed out:

<img width="1280" alt="Screenshot 2024-02-28 124813" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/db5ee337-f367-4857-97e6-4319f6757c83">

Each task can be deleted by clicking on the 'x' button associated with it:

<img width="1280" alt="Screenshot 2024-02-28 124828" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/7a5ec878-6417-4a2c-94fe-ebefbe0242c6">

When accesing the side menu, we have the option to view our lists:

<img width="1279" alt="Screenshot 2024-02-28 151532" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/320f74cb-eef4-4414-861b-487df3628153">
<img width="1280" alt="Screenshot 2024-02-28 125012" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/5c8d3a94-d657-4d95-a871-04e6c42bce3a">

To add a new list, we can click on the "ADD LIST" and enter the name of the list:

<img width="1280" alt="Screenshot 2024-02-28 125030" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/ddd1dad3-4abd-49a3-9374-cdab1897bdf3">
<img width="1280" alt="Screenshot 2024-02-28 125048" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/77784c96-32a6-42eb-9b8d-df74171759e0">

To remove any list, we can just click on the delete button associated with each list:

<img width="1280" alt="Screenshot 2024-02-28 125130" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/bc4cb75f-4bbb-4a3b-841e-35a2f06bfd91">

After deleting a list, the tasks associated with it will remain but will no longer be associated with that list.
To view the content of a list and add new tasks to it, simply click on the desired list:

<img width="1280" alt="Screenshot 2024-02-28 130028" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/7bf5b477-4332-4e1c-980f-8a007c5e0315">

Each task from the list can be modified and deleted.
To add a new task to the list, we need to click on the "ADD TASK" button and enter the necessary information:

<img width="1280" alt="Screenshot 2024-02-28 130055" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/6a95f832-2f53-470d-8fae-c55484ea9f89">
<img width="1280" alt="Screenshot 2024-02-28 130109" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/bf84c970-b5ac-44ba-ab52-0d769af79f7d">

Each task added to a list will be also visible from the home page: 

<img width="1280" alt="Screenshot 2024-02-28 125406" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/3777d49e-77b3-471b-a54c-d6470c3bbd36">

From the side menu, we can also access our overdue tasks, which can be modified and deleted as needed:

<img width="1280" alt="Screenshot 2024-02-28 125441" src="https://github.com/bdenisaloredana/productivityManagementApp/assets/126720196/f801cc57-01ce-4f98-aa97-0ce4673f07c6">

Additionally, from the side menu, clicking on the "LOGOUT" button redirects us to the login page. Otherwise, a user remains logged in for 3 days.
