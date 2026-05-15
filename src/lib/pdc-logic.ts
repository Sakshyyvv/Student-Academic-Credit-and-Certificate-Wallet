
import { CategoryRule, Certificate, PDCResults, User } from './types';

export const DEFAULT_CATEGORY_RULES: CategoryRule[] = [
  { 
    id: 'C1', 
    categoryName: 'Institute level (C1)', 
    maxCredits: 8, 
    weightage: 1.0,
    pointsPerCertificate: 2,
    description: 'Quizzes, extemporary, debate, student volunteers, seminar, industrial visit, local chapters (IET, IEEE, ISTE, IETE).'
  },
  { 
    id: 'C2', 
    categoryName: 'State level (C2)', 
    maxCredits: 9, 
    weightage: 1.0,
    pointsPerCertificate: 3,
    description: 'Robotics, coding challenge, social/societal welfare activities, cultural cum technical fest, volunteers, hackathon, sports etc.'
  },
  { 
    id: 'C3', 
    categoryName: 'National level (C3)', 
    maxCredits: 10, 
    weightage: 1.0,
    pointsPerCertificate: 5,
    description: 'Hands on workshop, national level seminar, national conference, model making, Entrepreneurship, national youth festival, techno cultural fest, research, project competition, sports festival, Qualified GATE / CAT or any other national level exam.'
  },
  { 
    id: 'C4', 
    categoryName: 'Department level committees (C4)', 
    maxCredits: 5, 
    weightage: 1.0,
    pointsPerCertificate: 5,
    description: 'OBE coordinators, Members of Board of Studies, departmental placement committee, departmental alumni cell, Class representatives, any other relevant department committee.'
  },
  { 
    id: 'C5', 
    categoryName: 'Institute level committees (C5)', 
    maxCredits: 6, 
    weightage: 1.0,
    pointsPerCertificate: 6,
    description: 'Institutional Placement cell as volunteers, Gender champions, Members of anti-ragging committees, Hegel mess committees, Office bearers in innovation and start-up cells, Club working committees, Student Mentors, Members of IQAC, any other relevant institute level committee.'
  },
  { 
    id: 'C6', 
    categoryName: 'MOOCS (C6)', 
    maxCredits: 12, 
    weightage: 1.0,
    pointsPerCertificate: 6,
    description: 'Successfully completed technical certification course in any MOOC\'s platform such as (NPTEL/SWAYAM/EdX/Coursera/Class Central etc.).'
  },
];

export function calculatePDCScore(
  certificates: Certificate[],
  rules: CategoryRule[],
  user?: User
): PDCResults {
  const approved = certificates.filter((c) => c.status === 'approved');
  
  // Initialize category credits
  const categoryCredits: Record<string, number> = {};
  rules.forEach((rule) => {
    categoryCredits[rule.categoryName] = 0;
  });

  // Sum credits per category with trimmed matching to avoid whitespace issues
  approved.forEach((cert) => {
    const matchingRule = rules.find(r => r.categoryName.trim() === cert.category.trim());
    if (matchingRule) {
      categoryCredits[matchingRule.categoryName] += cert.creditPoints;
    }
  });

  let weightedSum = 0;
  let totalExtraCredits = 0;
  let maxPossibleExtraScore = 0;

  rules.forEach((rule) => {
    const earned = categoryCredits[rule.categoryName];
    const effectiveCredits = Math.min(earned, rule.maxCredits);
    
    weightedSum += (effectiveCredits * rule.weightage);
    totalExtraCredits += earned;
    maxPossibleExtraScore += (rule.maxCredits * rule.weightage);
  });

  // Calculate Academic Credits
  const academicCredits = user?.semesterAcademicCredits?.reduce((acc, curr) => acc + curr.credits, 0) || 0;
  
  return {
    totalExtraCredits,
    academicCredits,
    categoryCredits,
    pdcScore: Number(weightedSum.toFixed(2)),
    totalCombinedScore: Number((weightedSum + academicCredits).toFixed(2)),
    maxPossiblePdcScore: Number(maxPossibleExtraScore.toFixed(2)),
  };
}
