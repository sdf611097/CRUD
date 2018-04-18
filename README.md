# CRUD
A demo project for CRUD
* This is a demo project for AWS Serverless, including API gateway, lambda, rds




Test it locally with mocha

```
npm install
npm test
```

Test it via api gateway
```
#create
curl  -X POST \
  'https://rbqi1gecxk.execute-api.us-east-1.amazonaws.com/test/user' \
  -H 'content-type: application/json' \
  -H 'x-amz-docs-region: us-east-1' \
  -d '{"name":"byCurl", "email":"curl@example.com", "password": "curlPasswd"}'

#get it by id
curl  \
  'https://rbqi1gecxk.execute-api.us-east-1.amazonaws.com/test/user/152' \
  -H 'content-type: application/json' \
  -H 'x-amz-docs-region: us-east-1'

#update user name
curl  -X PATCH \
  'https://rbqi1gecxk.execute-api.us-east-1.amazonaws.com/test/user/152' \
  -H 'content-type: application/json' \
  -H 'x-amz-docs-region: us-east-1' \
  -d '{"name":"newName"}'

#delete user
curl  -X DELETE \
  'https://rbqi1gecxk.execute-api.us-east-1.amazonaws.com/test/user/152' \
  -H 'content-type: application/json' \
  -H 'x-amz-docs-region: us-east-1'
```

Upload it via lambda dashboard
```
npm run bundle
```
