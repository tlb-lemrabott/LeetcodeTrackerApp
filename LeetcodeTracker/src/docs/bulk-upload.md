# Bulk Upload Functionality

## Overview

The Bulk Upload functionality allows you to upload multiple LeetCode problems in a single HTTP request, making it efficient to populate your tracker with a large number of problems at once.

## Endpoint

```
POST /problems/upload-list
```

## Request Format

### Content-Type
```
application/json
```

### Request Body
The request body should be a JSON array containing problem objects. Each problem object must include the following fields:

```json
[
  {
    "problemName": "string (required)",
    "comment": "string (required)", 
    "link": "string (required)",
    "status": "TODO | DOING | DONE (required)",
    "level": "EASY | MEDIUM | HARD (required)"
  }
]
```

### Field Descriptions

| Field | Type | Required | Description | Valid Values |
|-------|------|----------|-------------|--------------|
| `problemName` | String | Yes | The name of the LeetCode problem | Any non-empty string |
| `comment` | String | Yes | Description or notes about the problem | Any string |
| `link` | String | Yes | URL to the LeetCode problem | Valid URL format |
| `status` | Enum | Yes | Current status of the problem | `TODO`, `DOING`, `DONE` |
| `level` | Enum | Yes | Difficulty level of the problem | `EASY`, `MEDIUM`, `HARD` |

## Response Format

### Success Response (200 OK)
Returns an array of created problem objects with additional fields:

```json
[
  {
    "problemId": "uuid",
    "problemName": "string",
    "comment": "string",
    "link": "string", 
    "timePosted": "2025-09-08T00:52:29.278+00:00",
    "doneTime": "2025-09-08T00:52:29.278+00:00" | null,
    "status": "TODO | DOING | DONE",
    "level": "EASY | MEDIUM | HARD"
  }
]
```

### Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `problemId` | UUID | Auto-generated unique identifier |
| `timePosted` | DateTime | Timestamp when the problem was created |
| `doneTime` | DateTime | Timestamp when the problem was marked as DONE (null for TODO/DOING) |

## How It Works

### 1. Request Processing
- The controller receives the JSON array of problems
- Each problem object is validated against the required fields
- The request is passed to the `ProblemService.createProblemsBulk()` method

### 2. Service Layer Processing
- A current timestamp is generated for the batch
- For each problem in the array:
  - `timePosted` is set to the current timestamp
  - If `status` is `DONE`, `doneTime` is also set to the current timestamp
  - If `status` is `TODO` or `DOING`, `doneTime` remains `null`

### 3. Database Operations
- All problems are saved in a single batch operation using `repository.saveAll()`
- This is more efficient than individual saves for large datasets
- All operations are wrapped in a transaction for data consistency

### 4. Response Generation
- The service returns all created problem objects with their generated IDs
- The controller wraps the response in a `ResponseEntity` with HTTP 200 status

## Example Usage

### cURL Example
```bash
curl -X POST http://localhost:8080/problems/upload-list \
  -H "Content-Type: application/json" \
  -d '[
    {
      "problemName": "Two Sum",
      "comment": "Classic array + hashmap problem",
      "link": "https://leetcode.com/problems/two-sum/",
      "status": "TODO",
      "level": "EASY"
    },
    {
      "problemName": "Valid Parentheses", 
      "comment": "Stack based matching",
      "link": "https://leetcode.com/problems/valid-parentheses/",
      "status": "DONE",
      "level": "EASY"
    }
  ]'
```

### JavaScript/Fetch Example
```javascript
const problems = [
  {
    problemName: "Two Sum",
    comment: "Classic array + hashmap problem", 
    link: "https://leetcode.com/problems/two-sum/",
    status: "TODO",
    level: "EASY"
  },
  {
    problemName: "Valid Parentheses",
    comment: "Stack based matching",
    link: "https://leetcode.com/problems/valid-parentheses/", 
    status: "DONE",
    level: "EASY"
  }
];

fetch('http://localhost:8080/problems/upload-list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(problems)
})
.then(response => response.json())
.then(data => console.log('Created problems:', data))
.catch(error => console.error('Error:', error));
```

## Error Handling

### Validation Errors (400 Bad Request)
- Missing required fields
- Invalid enum values for `status` or `level`
- Invalid URL format for `link`

### Server Errors (500 Internal Server Error)
- Database connection issues
- Unexpected server errors

## Performance Considerations

### Batch Size Recommendations
- **Optimal batch size:** 10-100 problems per request
- **Maximum recommended:** 500 problems per request
- **For larger datasets:** Split into multiple requests

### Benefits of Bulk Upload
- **Reduced network overhead:** Single HTTP request vs multiple requests
- **Database efficiency:** Batch operations are faster than individual saves
- **Atomic operations:** All problems are created in a single transaction
- **Consistent timestamps:** All problems in a batch share the same creation time

## Implementation Details

### Controller Layer (`ProblemController.java`)
```java
@PostMapping("/upload-list")
public ResponseEntity<List<Problem>> createProblemsBulk(@RequestBody List<Problem> problems) {
    List<Problem> createdProblems = service.createProblemsBulk(problems);
    return ResponseEntity.ok(createdProblems);
}
```

### Service Layer (`ProblemService.java`)
```java
public List<Problem> createProblemsBulk(List<Problem> problems) {
    System.out.println("create problems bulk called! Count: " + problems.size());
    Date currentTime = new Date();
    
    // Set timePosted for all problems and doneTime for DONE problems
    for (Problem problem : problems) {
        problem.setTimePosted(currentTime);
        if (problem.getStatus() == ProblemStatus.DONE) {
            problem.setDoneTime(currentTime);
        }
    }
    
    return repository.saveAll(problems);
}
```

## Testing

The bulk upload functionality has been tested with:
- ✅ Single problem upload
- ✅ Multiple problems upload (10+ problems)
- ✅ Mixed status problems (TODO, DOING, DONE)
- ✅ All difficulty levels (EASY, MEDIUM, HARD)
- ✅ Proper timestamp handling
- ✅ Error handling for invalid data

## Related Documentation

- [JSON File Import](import-json.md) - For importing problems from JSON files
