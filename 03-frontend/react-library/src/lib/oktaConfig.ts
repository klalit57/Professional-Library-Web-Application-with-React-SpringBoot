export const oktaConfig = {
    clientId:'0oa8gczntuQGFN0nP5d7',
    issuer:'https://dev-63761843.okta.com/oauth2/default',
    redirectUri:'https://localhost:3000/login/callback',
    scopes:['openid','profile','email'],
    pkce:true,
    disableHttpsCheck:true,

}