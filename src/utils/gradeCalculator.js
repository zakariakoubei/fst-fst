export function calculateModuleAverage(gradeEntry, formula) {
  if (!gradeEntry || !formula) return 0;

  const exam = Number(gradeEntry.exam) || 0;
  const td = Number(gradeEntry.td) || 0;
  const tp = Number(gradeEntry.tp) || 0;
  const cc = Number(gradeEntry.cc) || 0;

  const wExam = (Number(formula.exam) || 0) / 100;
  const wTd = (Number(formula.td) || 0) / 100;
  const wTp = (Number(formula.tp) || 0) / 100;
  const wCc = (Number(formula.cc) || 0) / 100;

  const totalWeight = wExam + wTd + wTp + wCc;
  if (totalWeight <= 0) return 0;

  const weighted = exam * wExam + td * wTd + tp * wTp + cc * wCc;
  return Number((weighted / totalWeight).toFixed(2));
}

export function isModuleValidated(average, passingGrade = 12) {
  return Number(average) >= Number(passingGrade);
}