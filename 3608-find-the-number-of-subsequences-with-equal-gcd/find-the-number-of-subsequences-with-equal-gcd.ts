function subsequencePairCount(nums: number[]): number {
    const MOD = 1e9 + 7;
    
    function gcd(a: number, b: number): number {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    const maxNum = Math.max(...nums);
    const M = maxNum + 1;
    
    // dp[i][j] = number of pairs where seq1 has gcd i and seq2 has gcd j
    let dp: number[][] = Array(M).fill(0).map(() => Array(M).fill(0));
    dp[0][0] = 1;
    
    for (const num of nums) {
        const dp2: number[][] = Array(M).fill(0).map(() => Array(M).fill(0));
        
        for (let i = M - 1; i >= 0; i--) {
            for (let j = M - 1; j >= 0; j--) {
                if (dp[i][j] === 0) continue;
                
                const v = dp[i][j];
                const i2 = i === 0 ? num : gcd(i, num);
                const j2 = j === 0 ? num : gcd(j, num);
                
                // Add to first subsequence
                dp2[i2][j] = (dp2[i2][j] + v) % MOD;
                
                // Add to second subsequence
                dp2[i][j2] = (dp2[i][j2] + v) % MOD;
                
                // Skip this element
                dp2[i][j] = (dp2[i][j] + v) % MOD;
            }
        }
        
        dp = dp2;
    }
    
    let result = 0;
    for (let i = 1; i < M; i++) {
        result = (result + dp[i][i]) % MOD;
    }
    
    return result;
}