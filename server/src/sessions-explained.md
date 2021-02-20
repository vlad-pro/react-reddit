# Sessions explained

## Step 1

ctx.req.session.userId = user.id
getting user.id into the session object

## Step 2

{userId: 1} -> send to redis

sess:fwnsldkaqadvsf -> { userId: 1 }
express-session middleware will set a cookie on the user's browser asdfjnaksjdnvajdfnv - the signed/encrypted version of the redis key

## Step 3

when user makes a request the cookie value is sent to the server
asdfjnaksjdnvajdfnv -> sent to the server

## Step 4

on a server the value is unsigned/decrypted back with the secret we specified in express-session config in index.ts
asdfjnaksjdnvajdfnv -> sess:fwnsldkaqadvsf

## Step 5

express-session makes a request to redis with the decrypted key
sess:fwnsldkaqadvsf -> { userId: 1 }
and stire the object in:
req.session = {user.id}
