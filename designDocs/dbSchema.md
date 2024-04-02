# Database Schemas
Schemas are described using TS-ish syntax

---

# `WebhookInfo`

```ts
type WebhookInfo = {
    _id: ObjectId               // uid assigned to this webhook recieving endpoint by mongo
    name: string                // A user assigned human readable name, need not be unique, just used for filtering
    destinationUrls: string[]   // Array of URLs to which the webhook will be forwarded to
    log: WebhookLogEntry._id[]  // An array of _ids of log entries which correspond to this webhook
    ownerId: User._id             // The _id of the owner of this webhook
    active: boolean             // Let the user deactivate the webhook without deleting it
    archived: boolean           // Deleted webhooks get archived, because the logs might still reference the document
    created: Date               // Timestamp this webhook was created at
}

```
The path the webhook is recieved at is derived from the id

---

# `User`

```ts
type User = {
    _id: ObjectId                       // id assigned to this user by mongo
    username: string                    // username as provided by GitHub
    avatar: string                      // avatar image URL as provided by GitHub
    registeredAt: Date                  // The first time this user signed in
    lastSignIn: Date                    // The last time this user signed in
    webhooks: WebhookInfo._id[]         // An array of _ids of the unarchived webhooks that this user owns
    deletedWebhooks: WebhookInfo._id[]  // An array of _ids of the archived webhooks that this user owns
}
```

---

# `WebhookLogEntry`

```ts
type WebhookLogEntry = {
    _id: Date                   // Time this webhook was recieved, this is the cluster and TTL key
    webhookId: WebhookInfo._id  // The _id of the webhook
    senderIp: string            // The IP address of the sender
    ownerId: User._id           // The _id of the webhook's owner
    data: unknown               // The JSON data recieved
    successfulForwards: number  // Number of WebhookInfo.destinationUrls the data was successfully recieved by at the time of being recieved by the server
}
```

---
