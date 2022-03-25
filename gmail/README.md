# email filter

------------------------------steps to start the project running---------------------------------------------

1. generate access token through this link   [https://qascript.com/oauth-2-0-authorization-with-gmail-api-in-postman/?msclkid=5ae23f8ca89011ecb3381e96ce817702]

2. create a project and pub/sub with this link and grant permission [https://developers.google.com/gmail/api/guides/push]

3. ngrok should be used to generate a live link to use on the push request on pub/sub set up [https://console.cloud.google.com/cloudpubsub/subscription/detail/mydemo?project=mydemo-345010]

4. In post man a watch request should be generated all the time with this link on get request details [http://localhost:3001/watch]

5. run npm dev to start the server and also npm run tunnel to start the ngrok