---
description: >-
  Embeds are stylish, they're here to keep the everything's organized in a
  single block.
---

# # Creating embeds

## Let's get started.

### Example of embed layout:

<pre class="language-javascript"><code class="lang-javascript"><strong>var embed = {
</strong>  "title": "embed title",
  "description": "embeds support a **different** __subset__ *of* markdown than other markdown fields. &#x3C;@Ann6LewA>\n\n [links](https://www.guilded.gg) ```\ncheck this code out```\n\n:pizza: time!! ttyl",
  "url": "https://www.guilded.gg",
  "color": 6118369,
  "timestamp": "2022-04-12T22:14:36.737Z",
  "footer": {
    "icon_url": "https://www.guilded.gg/asset/Logos/logomark/Color/Guilded_Logomark_Color.png",
    "text": "footer text"
  },
  "thumbnail": {
    "url": "https://www.guilded.gg/asset/Logos/logomark/Color/Guilded_Logomark_Color.png"
  },
  "image": {
    "url": "https://www.guilded.gg/asset/Logos/logomark_wordmark/Color/Guilded_Logomark_Wordmark_Color.png"
  },
  "author": {
    "name": "Gil",
    "url": "https://www.guilded.gg",
    "icon_url": "https://www.guilded.gg/asset/Default/Gil-md.png"
  },
  "fields": [
    {
      "name": "hello",
      "value": "these are fields"
    },
    {
      "name": "~~help i have been crossed out~~",
      "value": "~~oh noes~~",
      "inline": true
    },
    {
      "name": "another inline",
      "value": "field",
      "inline": true
    }
  ]
}</code></pre>

{% hint style="info" %}
Example taken from Guilded API Docs.
{% endhint %}

### Now, let's send it.

```javascript
Client.createMessage({embeds: [embed]})
```
