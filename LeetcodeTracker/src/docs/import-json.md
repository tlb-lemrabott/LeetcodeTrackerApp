# JSON File Import Functionality

## Overview

The JSON File Import functionality allows you to upload a JSON file containing multiple LeetCode problems, making it convenient to import problems from external sources or backup files.

## Endpoint

```
POST /problems/import-json
```

## Request Format

### Content-Type
```
multipart/form-data
```

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | JSON file containing array of problem objects |

### File Requirements
- **File extension:** Must be `.json`
- **File size:** Must not be empty
- **Content format:** JSON array of problem objects
- **Encoding:** UTF-8 recommended

## File Format

The JSON file should contain an array of problem objects with the following structure:

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

### 1. File Upload Processing
- The controller receives the multipart file upload
- File validation is performed (extension, size, content)
- The file is passed to the `ProblemService.importProblemsFromJsonFile()` method

### 2. File Validation
- Checks if the file is not empty
- Validates that the file has a `.json` extension
- Attempts to parse the JSON content

### 3. JSON Parsing
- Uses Jackson ObjectMapper to parse the JSON file
- Converts the JSON array to a List of Problem objects
- Validates that the parsed list is not null or empty

### 4. Problem Processing
- Uses the existing `createProblemsBulk()` method for consistency
- Sets timestamps for all problems
- Handles DONE status problems with completion timestamps

### 5. Database Operations
- All problems are saved in a single batch operation
- Transaction ensures data consistency
- Returns all created problems with their generated IDs

## Example Usage

### cURL Example
```bash
curl -X POST http://localhost:8080/problems/import-json \
  -F "file=@problems.json"
```

### JavaScript/Fetch Example
```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);

fetch('http://localhost:8080/problems/import-json', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log('Imported problems:', data))
.then(data => console.log(`Successfully imported ${data.length} problems`))
.catch(error => console.error('Error:', error));
```

### HTML Form Example
```html
<form id="importForm" enctype="multipart/form-data">
  <input type="file" id="fileInput" accept=".json" required>
  <button type="submit">Import Problems</button>
</form>

<script>
document.getElementById('importForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a JSON file');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/problems/import-json', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      alert(`Successfully imported ${data.length} problems!`);
    } else {
      alert('Import failed. Please check your file format.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Import failed due to an error.');
  }
});
</script>
```

## Example JSON File

Create a file named `problems.json` with the following content:

```json
[
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
  },
  {
    "problemName": "Longest Substring Without Repeating Characters",
    "comment": "Sliding window technique",
    "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "status": "DOING",
    "level": "MEDIUM"
  }
]
```

## Error Handling

### Validation Errors (400 Bad Request)
- **Empty file:** "File is empty"
- **Invalid file type:** "File must be a JSON file"
- **Invalid JSON format:** "Invalid JSON format: [error details]"
- **Empty problems array:** "No problems found in the JSON file"
- **Missing required fields:** Standard validation errors for problem fields
- **Invalid enum values:** Invalid status or level values

### Server Errors (500 Internal Server Error)
- Database connection issues
- File processing errors
- Unexpected server errors

## Performance Considerations

### File Size Recommendations
- **Optimal file size:** 1-10 MB
- **Maximum recommended:** 50 MB
- **For larger datasets:** Split into multiple files

### Benefits of File Import
- **Convenience:** Upload pre-prepared problem lists
- **Backup/Restore:** Import from exported data
- **Batch Operations:** Efficient processing of large datasets
- **Offline Preparation:** Create files offline and upload later

## Implementation Details

### Controller Layer (`ProblemController.java`)
```java
@PostMapping("/import-json")
public ResponseEntity<List<Problem>> importProblemsFromJson(@RequestParam("file") MultipartFile file) {
    try {
        List<Problem> createdProblems = service.importProblemsFromJsonFile(file);
        return ResponseEntity.ok(createdProblems);
    } catch (IOException e) {
        return ResponseEntity.badRequest().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}
```

### Service Layer (`ProblemService.java`)
```java
public List<Problem> importProblemsFromJsonFile(MultipartFile file) throws IOException {
    System.out.println("import problems from JSON file called! File: " + file.getOriginalFilename());
    
    // Validate file
    if (file.isEmpty()) {
        throw new IllegalArgumentException("File is empty");
    }
    
    if (!file.getOriginalFilename().toLowerCase().endsWith(".json")) {
        throw new IllegalArgumentException("File must be a JSON file");
    }
    
    // Parse JSON file
    ObjectMapper objectMapper = new ObjectMapper();
    List<Problem> problems;
    
    try {
        problems = objectMapper.readValue(file.getInputStream(), new TypeReference<List<Problem>>() {});
    } catch (Exception e) {
        throw new IllegalArgumentException("Invalid JSON format: " + e.getMessage());
    }
    
    // Validate problems list
    if (problems == null || problems.isEmpty()) {
        throw new IllegalArgumentException("No problems found in the JSON file");
    }
    
    // Use existing bulk create method
    return createProblemsBulk(problems);
}
```

## Testing

The JSON file import functionality has been tested with:
- ✅ Valid JSON files with multiple problems
- ✅ Mixed status problems (TODO, DOING, DONE)
- ✅ All difficulty levels (EASY, MEDIUM, HARD)
- ✅ Proper timestamp handling
- ✅ File validation (empty files, non-JSON files)
- ✅ JSON format validation
- ✅ Error handling for various failure scenarios

## Related Endpoints

- `POST /problems/upload-list` - Bulk upload problems via JSON data
- `POST /problems` - Create a single problem
- `GET /problems` - Retrieve all problems
- `GET /problems/{id}` - Retrieve a specific problem
- `PUT /problems/{id}` - Update a specific problem
- `DELETE /problems/{id}` - Delete a specific problem
