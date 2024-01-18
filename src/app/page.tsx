"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoinChange {
  count: number;
  coins: { [key: string]: number };
}

const CoinChangeVisualizer: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [coins, setCoins] = useState<number[]>([25, 10, 5, 1]);
  const [change, setChange] = useState<CoinChange>({ count: 0, coins: {} });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    calculateChange();
  }, [amount, coins]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.valueAsNumber);
  };

  const handleCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const coinsInput = e.target.value
      .split(",")
      .map((coin) => parseInt(coin.trim()))
      .filter((coin) => !isNaN(coin));

    setCoins(coinsInput);
  };

  const calculateChange = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (isNaN(amount) || !Array.isArray(coins) || coins.length === 0) {
        setChange({ count: -1, coins: {} });
        setIsLoading(false);
        return;
      }

      const dp: number[] = new Array(
        isNaN(amount) || amount < 0 ? 0 : amount + 1
      ).fill(Infinity);
      const coinUsed: number[] = new Array(amount + 1).fill(-1);
      dp[0] = 0;

      for (let i = 1; i <= amount; i++) {
        for (let j = 0; j < coins.length; j++) {
          if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {
            dp[i] = dp[i - coins[j]] + 1;
            coinUsed[i] = j;
          }
        }
      }

      if (dp[amount] === Infinity) {
        setChange({ count: -1, coins: {} });
      } else {
        const usedCoins: { [key: string]: number } = {};

        coins.forEach((coin) => {
          usedCoins[coin.toString()] = 0;
        });

        let remainingValue = amount;

        while (remainingValue > 0) {
          const usedCoinValue = coins[coinUsed[remainingValue]];
          usedCoins[usedCoinValue.toString()]++;
          remainingValue -= usedCoinValue;
        }

        setChange({ count: dp[amount], coins: usedCoins });
      }

      setIsLoading(false);
    }, 0);
  };

  return (
    <div className="mx-auto md:w-2/3 max-w-[68rem]">
      <h1 className="text-4xl font-bold mb-4">Coin Change Visualizer</h1>
      <div className="space-y-2">
        <div>
          <Label className="text-sm mb-2">Enter Amount:</Label>
          <Input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="border p-2"
            placeholder="100"
          />
        </div>
        <div>
          <Label className="text-sm mb-2">Coins (25, 10, 5, 1): </Label>
          <Input
            onChange={handleCoinsChange}
            className="border p-2"
            placeholder="25, 10, 5, 1"
          />
        </div>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <h2 className="text-xl text-center font-bold mb-2">Calculating...</h2>
        ) : change.count === -1 ? (
          <h2 className="text-xl text-center font-bold mb-2">
            There is no way to make change for undefined amount with the given
            coins.
          </h2>
        ) : (
          <>
            <h2 className="text-xl text-center font-bold mb-2">
              Change: {change.count} coins needed to make ${amount}.
            </h2>
            <ul className="grid grid-cols-3 gap-2">
              {Object.entries(change.coins).map(([coinValue, count]) => (
                <li
                  key={coinValue}
                  className="border flex rounded-md px-4 py-2 justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-extrabold">{coinValue}$</p>
                    <p className="text-muted-foreground">Amount:</p>
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold text-yellow-400">
                      {count}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinChangeVisualizer;
