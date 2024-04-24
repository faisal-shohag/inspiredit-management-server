# School Management System

## API DOC
### Before API Call
Api call function should have-
```javascript
'credentials': 'include',
headers: {
 'Content-Type': 'application/json',
}
```
- Example:
```javascript
fetch('http://{apiurl}/admin_login', { 
        method: 'POST',
        credentials: 'include', // Send cookies along with the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: 'email@email.com', password: '******'})
      })
      .then(res=> res.json())
      .then(data=> {
          console.log(data)
      })
      .catch(err=> {
          console.log(err)
      })
 ```
 
 ---
 ## Call METHODS
 ##### Please carefully look at the fields required when perform ```POST``` call. The ```?``` symbol signifies that this field is ```optional``` otherwise it is ```required```. For example below on ```Admin Login``` the ```name``` and ```phone``` fields are optional but the ```email``` and ```password``` fileds are required. Your frontend should handle this things otherwise you will get an ```error```.
 
 ##### When uploading image ```image``` should be in ```byte-array```. You can convert it on frontend using ```new Uint8Array()``` instance.
## POST METHODS
#### Admin Login
```javascript
{api_url}/admin_login
```

```javascript
fields: 
{  
  name       String?
  email      String    @unique
  phone      String?
  password   String
}
```

#### Teacher adding
```javascript
{api_url}/teacher
```
```javascript
fields: 
{ 
  name       String
  email      String    @unique
  phone      String
  password   String
  present_address  String?
  permanent_address String?
  joining_date String
  fixed_salary Int @default(0)
  nid String? 
  image Bytes?
  gender String?
  designation String?
  department String
  date_of_birth String?
  education String?
  blood_group String?
}
```
----

## GET METHODS
#### Admin Logout
```javascript
{api_url}/admin_logout
```

#### All teachers-
```javascript
{api_url}/teachers
```




