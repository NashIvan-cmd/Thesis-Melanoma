export const calculateAdjustedScore = (baseScore: number, assessmentType: string) => {
    let score = baseScore || 0;
    
    // Apply score adjustments based on assessment type
    if (assessmentType === "Possibly Malignant") {
      score += 20;
    } else if (assessmentType === "Likely Malignant") {
      score += 40;
    }
    
    // Cap score at 100 maximum
    return Math.min(score, 100);
  };