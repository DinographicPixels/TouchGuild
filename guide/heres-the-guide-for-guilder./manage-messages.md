---
description: >-
  It's a basis! You'll need to manage messages, and it's the goal of a bot to
  reply, interact with sent messages!
---

# 👾 Manage messages

## Create messages

```javascript
// You have different ways to send messages, they're simple!

// Create message within client, which requires the channel id.
Client.createMessage('insert channel id here', {content: "heyo!"})

// Create message within message which doesn't require the channel id.
// It is used to reply to a message
message.createMessage({content: 'cronge!'}) // easy, right?
```

## Modifying messages

Modify, edit, update.. messages! We'll see multiple ways to do this action.

### Modifying a message within client

```javascript
Client.editMessage('chanel id here', 'message id here', {content 'new content here!'})
```

### Let's do it within the message itself

```javascript
message.edit({content: 'new content here!'}) // yes, the syntax changes a bit :)
```

## Deleting messages

```javascript
// within client
Client.deleteMessage('channel id here', 'message id herer')

// within message itself
message.delete(); // the easiest!
```
