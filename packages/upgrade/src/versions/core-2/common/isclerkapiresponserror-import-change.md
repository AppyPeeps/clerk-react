---
title: '`isClerkAPIResponseError` import moved under `/errors`'
matcher: "import\\s+{[^}]*?isClerkAPIResponseError[\\s\\S]*?from\\s+['\"]@clerk\\/(clerk-react)(?!\/errors)[\\s\\S]*?['\"]"
matcherFlags: 'm'
category: 'error-imports'
replaceWithString: 'clerk-react/errors'
---

The `isClerkAPIResponseError` import path has changed from `@appypeeps/clerk-react` to `@appypeeps/clerk-react/errors`. You must update your import path in order for it to work correctly. Example below of the fix that needs to be made:

```diff
- import { isClerkAPIResponseError } from "@appypeeps/clerk-react"
+ import { isClerkAPIResponseError } from "@appypeeps/clerk-react/errors"
```
