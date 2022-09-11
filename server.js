const fetch = require("node-fetch")
const express = require('express')
const app = express()
const port = 3000

const clientId = process.argv[2];
const clientSecret = process.argv[3];
const clientScopes = process.argv[4];
const nextidDomain = process.argv[5];
const nextidTenant = process.argv[6];

console.log('args: ', process.argv);

const nextidApi = `https://idpapi.${nextidDomain}/${nextidTenant}/me`

const ClientOAuth2 = require('client-oauth2')
var nextidAuth = new ClientOAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  accessTokenUri: `https://oauth.${nextidDomain}/oauth2/token`,
  authorizationUri: `https://oauth.${nextidDomain}/oauth2/auth`,
  redirectUri: `http://localhost:${port}/oauth2/callback`,
  scopes: clientScopes.split(' ')
})

app.use(express.static('public'))

app.get('/clientId', (req, res) => {
  res.send(JSON.stringify({ clientId }))
})

app.get('/auth/nextid', function (req, res) {
  let state = "0123456789abcdef0123456789abcdef" // random string of length 32
  var uri = nextidAuth.code.getUri({state: state})
  uri += `&tenant_id=${nextidTenant}`
  console.log(uri)
 
  res.redirect(uri)
})
 
app.get('/oauth2/callback', function (req, res) {
  console.log(req.originalUrl)
  console.time("getToken");
  nextidAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      console.log('user: ', user) //=> { accessToken: '...', tokenType: 'bearer', ... }
      console.timeEnd("getToken");
 
      return user.accessToken
    })
    .then(function (token){
      console.log('token: ', token)
      return getUserInfo(token)
    })
    .then(function (userInfo){
      console.log('userInfo: ', userInfo)
      res.redirect(`http://localhost:${port}?${Object.keys(userInfo.data).map(key => `${key}=${encodeURIComponent(userInfo.data[key])}`).join('&')}`)
    })
    .catch(error => console.log(error))
})

async function getUserInfo(accessToken) {
  console.time("getUserInfo");
  const response = await fetch(
    nextidApi,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  const json = await response.json()
  console.timeEnd("getUserInfo");
  return json
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
