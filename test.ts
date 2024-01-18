const calculateChange = (
  amount: number,
  coins: number[]
): { [key: number]: number }[] => {
  if (isNaN(amount) || !Array.isArray(coins)) return [];

  const dp: Array<number[][]> = Array(amount + 1)
    .fill(null)
    .map(() => []);
  dp[0] = [[]];

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        for (const combination of dp[i - coin]) {
          dp[i].push([...combination, coin]);
        }
      }
    }
  }

  return dp[amount].map((combination) => {
    const count: { [key: number]: number } = {};
    for (const coin of coins) {
      count[coin] = combination.filter((c: number) => c === coin).length;
    }
    return count;
  });
};

const sum: number = 4;
const coins: number[] = [1, 2, 3, 4];
const result = calculateChange(sum, coins);

console.log(result);
