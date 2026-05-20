---
title: "Markdown Featues shown in prakix"
description: "A comprehensive test post demonstrating all available Markdown features, styling options, and blog system capabilities including headings, code blocks, images, tables, and more."
pubDatetime: 2026-05-20T10:00:00+02:00
tags: ["markdown", "test", "showcase", "features"]
heroImage: "/img/2026/openclaw/clawcon.jpg"
draft: false
---

This is a **comprehensive test post** showcasing every Markdown feature available in this blog system. Use this as a reference when writing new posts.

## Text Formatting

Regular paragraph with **bold text**, *italic text*, and ***bold italic combined***. You can also use `inline code` for technical terms.

Here's a blockquote:

> This is a blockquote. It should stand out from regular text with a left border and slightly different styling. Perfect for highlighting important information, quotes, or callouts.

---

## Headings

### Heading 3
#### Heading 4

---

## Code Blocks

JavaScript:

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

const result = greet("World");
```

Python:

```python
def calculate_fibonacci(n: int) -> list[int]:
    """Calculate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

# Example usage
fib_numbers = calculate_fibonacci(10)
print(fib_numbers)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

Swift:

```swift
import Foundation

struct User: Codable {
    let id: UUID
    let name: String
    let email: String
    let createdAt: Date

    var displayName: String {
        return name.isEmpty ? email : name
    }
}

// Example
let user = User(
    id: UUID(),
    name: "John Doe",
    email: "john@example.com",
    createdAt: Date()
)
```

SQL:

```sql
SELECT
    p.id,
    p.title,
    p.published_at,
    COUNT(c.id) as comment_count
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE p.draft = false
  AND p.published_at <= NOW()
GROUP BY p.id, p.title, p.published_at
ORDER BY p.published_at DESC
LIMIT 10;
```

---

## Lists

### Unordered List

- First item
- Second item
  - Nested item
  - Another nested item
    - Deeply nested
- Third item

### Ordered List

1. Step one
2. Step two
   1. Substep A
   2. Substep B
3. Step three

### Task List

- [x] Write blog post
- [x] Add code examples
- [ ] Add more content
- [ ] Review and edit

---

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Headings | ✅ Working | H1-H6 supported |
| Bold/Italic | ✅ Working | Standard Markdown |
| Code blocks | ✅ Working | With syntax highlighting |
| Images | ✅ Working | With lazy loading |
| Tables | ✅ Working | Grid alignment |
| Blockquotes | ✅ Working | Left border style |
| Links | ✅ Working | Blue underline on hover |
| Lists | ✅ Working | Ordered & unordered |

---

## Links

[Internal link to home page](/)

[External link to Google](https://www.google.com)

---

## Images

Below is an image embedded using standard Markdown syntax:

![Project screenshot](/assets/projects/Bruno.png)

Images are automatically styled with rounded corners and shadow. The prose container handles proper sizing and margins.

---

## Horizontal Rules

Three dashes create a horizontal divider:

---

Perfect for separating sections visually.

---

## Nested Content

> **Note:** Blockquotes can contain multiple paragraphs and other formatting.
>
> Like this second paragraph within the same blockquote.
>
> - And even lists within blockquotes
> - Are supported

---

## Edge Cases

Inline code: `const x = \`template literal\``

Strong emphasis: **bold**

Emphasis: *italic*

Combined: ***bold italic***

Strikethrough: ~~not needed but works~~

That's all the basic Markdown features covered. Happy writing!