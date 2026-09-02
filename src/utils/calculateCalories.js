
export const calculateCalories = ({ height, weight, age, desiredWeight }) => {
  if (!height || !weight || !age) return null;
  if (height < 100 || height > 250) return null;
  if (weight < 20 || weight > 500) return null;
  if (age < 18 || age > 100) return null;

  const h = Number(height) || 0;
  const w = Number(weight) || 0;
  const a = Number(age) || 0;
  const dW = Number(desiredWeight) || w;

  const bmr = 10 * w + 6.25 * h - 5 * a - 161;

  const weightDiff = w - dW;
  const deficit = weightDiff > 0 ? 500 : 0;

  const dailyRate = Math.max(Math.round(bmr - deficit), 1200); 
  const consumed = 0;
  const left = dailyRate - consumed;
  const percentage = Math.round((consumed / dailyRate) * 100) || 0;

  return { dailyRate, consumed, left, percentage };
};
