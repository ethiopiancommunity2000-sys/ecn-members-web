// src/utils/dateUtils.ts



export const formatToInputDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [month, day, year] = dateStr.split('/');
  if (!month || !day || !year) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Optional: converts yyyy-MM-dd (input format) to MM/dd/yyyy
export const formatToDisplayDate = (input: string): string => {
  if (!input) return '';
  const [year, month, day] = input.split('-');
  if (!year || !month || !day) return '';
  return `${month}/${day}/${year}`;
};


//   const formatToInputDate = (dateStr: string) => {
//     if (!dateStr) return '';
//     const [month, day, year] = dateStr.split('/');
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// };


