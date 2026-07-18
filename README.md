# Internship Application Tracker

A TypeScript-based application that allows students to apply for internship opportunities, while administrators manage internship listings and track application progress through a multi-step status lifecycle (**Pending → Under Review → Interview Scheduled → Accepted/Rejected**). 

## Interfaces & Types

Defined in `types/index.ts`:

### Core Entities

* **Applicant** – represents a user applying for internships with a role field (`student | admin | instructor`)
* **Internship** – represents an internship opportunity offered by a company
* **Application** – represents an internship application submitted by an applicant

### Enums

* **ApplicationStatus** – application lifecycle:

  * `Pending`
  * `UnderReview`
  * `InterviewScheduled`
  * `Accepted`
  * `Rejected`

* **Role** *(const enum)* – available user roles:

  * `Student`
  * `Admin`
  * `Instructor`

### Generic Interface

* **ApiResponse<T>** – reusable generic interface for API responses

### Utility Types

* **ApplicantUpdate** – uses `Partial<Applicant>` for updating applicant information
* **ApplicantPreview** – uses `Pick<Applicant, "id" | "name" | "role">` for displaying selected applicant details
* **PublicApplicant** – uses `Omit<Applicant, "email" | "isActive">` to hide sensitive information
* **StatusLabels** – uses `Record<ApplicationStatus, string>` to map application statuses to readable labels

### Generic Function

Defined in `src/index.ts`:

* **getById<T>()** – reusable generic function that retrieves any entity by its ID (Applicant, Internship, or Application)

## Features

* Manage applicants
* Store internship opportunities
* Track internship applications
* Display application status using enums
* Retrieve records using a reusable generic function
* Demonstrate TypeScript utility types and generic interfaces

## Setup & Running

1. Install dependencies:

```bash
npm install
```

2. Compile the project:

```bash
npx tsc
```

3. Run the compiled TypeScript:

```bash
npx ts-node src/index.ts
```

4. Check for TypeScript errors:

```bash
npx tsc --noEmit
```

The project should compile successfully with **zero TypeScript errors** under **strict mode**.
