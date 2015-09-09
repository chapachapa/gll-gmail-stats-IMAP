# Gmail Statistics using IMAP
- Please create a login.json file that looks like this:
```
{
  "user": "mygmail@gmail.com",
  "password": "mypassword",
  "host": "imap.gmail.com",
  "port": 993,
  "tls": true
}
```

- You must change your Google settings to run unsigned(safe) apps and allow Gmail to be accessed using IMAP.
-- It is highly recommended to use a secondary (or dummy account) for this.

- Don't forget to *npm install*!