## Database design

### Tables

Job
- Title
- User (user_id)
- Location
- Pay
- Type (internships/part-time/full-time)
- Job description (long text field)

Resume
- Summary (text field)

Education (references Resume)
- Title
- Degree (associates, bachelors, etc.)
- Major
- GPA
- Start date
- End data
- Description

Experience (references Resume)
- Title
- Company
- Start date
- Current job (bool)
- End date
- Description
- Type (job, project)

Skills (references Job or Resume)
- jobId (nullable)
- resumeId (nullable)
- skill