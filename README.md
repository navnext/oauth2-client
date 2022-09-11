# NextID OAuth 2.0 client apps demo

NextID client application demo. Basically a simple OAuth 2.0 client application. The application shows login button which will redirect user to NextID login page when clicked. If the login process was successful, it will the shows basic information about the logged in user. 

## Running the Demo apps

To run the project, enter required information in `run.sh` file, and then execute the following commands:

```
npm install
./run.sh
```

Apps will run on port 3000: `http://localhost:3000`.

`CLIENT_ID`, `CLIENT_SECRET` and `CLIENT_SCOPES` must be obtained from NextID management UI. To create new client application in NextID management UI, please refer to [the documentation](https://nextid-docs.cloud.nextplatform.ai/identity-admin/applications/create).

## Disclaimer

This project is based on [https://github.com/ionelh/google-oauth-demo-app](google-oauth-demo-app) modified to use [client-oauth2](https://www.npmjs.com/package/client-oauth2) package