import { User, Course, Grade } from "../types";

function getUser(id: number): User {
  return {
    id: id,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
    score: 95.5,
  };
}

function calculateGrade(score: number, maxScore: number): string {
  const percentage: number = (score / maxScore) * 100;

  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  return "F";
}

function formatCourse(name: string, units: number, semester: string): string {
  const course: Course = {
    name,
    units,
    semester,
  };

  return `${course.name} (${course.units} units) - ${course.semester}`;
}

const user: User = getUser(1);

const grade: Grade = {
  score: 85,
  maxScore: 100,
  percentage: (85 / 100) * 100,
  letterGrade: calculateGrade(85, 100),
};

console.log(user);
console.log(grade.letterGrade);
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));