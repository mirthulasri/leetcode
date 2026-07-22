function maxActiveSectionsAfterTrade(s: string, queries: number[][]): number[] {
    const n = s.length;
    let ones_total = 0;
    for (let i = 0; i < n; i++) if (s[i] === '1') ones_total++;
    
    const zero_runs: [number, number][] = [];
    let i = 0;
    while (i < n) {
        if (s[i] === '0') {
            let start = i;
            while (i < n && s[i] === '0') i++;
            zero_runs.push([start, i - 1]);
        } else {
            i++;
        }
    }
    
    const pairs: [number, number, number, number, number][] = [];
    for (let k = 0; k < zero_runs.length - 1; k++) {
        const [L1, R1] = zero_runs[k];
        const [L2, R2] = zero_runs[k+1];
        pairs.push([L1, R1, L2, R2, (R1 - L1 + 1) + (R2 - L2 + 1)]);
    }
    
    const num_pairs = pairs.length;
    const qLen = queries.length;
    const ans: number[] = [];
    
    if (num_pairs === 0) {
        for (let q = 0; q < qLen; q++) {
            ans.push(ones_total);
        }
        return ans;
    }
    
    const K = num_pairs.toString(2).length;
    const st: number[][] = Array.from({ length: num_pairs }, () => new Array(K).fill(0));
    for (let j = 0; j < num_pairs; j++) {
        st[j][0] = pairs[j][4];
    }
    
    for (let j = 1; j < K; j++) {
        for (let idx = 0; idx <= num_pairs - (1 << j); idx++) {
            st[idx][j] = Math.max(st[idx][j-1], st[idx + (1 << (j-1))][j-1]);
        }
    }
    
    const query_st = (L: number, R: number): number => {
        if (L > R) return 0;
        const j = (R - L + 1).toString(2).length - 1;
        return Math.max(st[L][j], st[R - (1 << j) + 1][j]);
    };
    
    const lowerBound = (arr: number[], val: number): number => {
        let l = 0, r = arr.length;
        while (l < r) {
            const mid = (l + r) >> 1;
            if (arr[mid] >= val) r = mid;
            else l = mid + 1;
        }
        return l;
    };
    
    const upperBound = (arr: number[], val: number): number => {
        let l = 0, r = arr.length;
        while (l < r) {
            const mid = (l + r) >> 1;
            if (arr[mid] > val) r = mid;
            else l = mid + 1;
        }
        return l;
    };
    
    const R1_list = pairs.map(p => p[1]);
    const L2_list = pairs.map(p => p[2]);
    
    for (const [l, r] of queries) {
        const first_k = lowerBound(R1_list, l);
        const last_k = upperBound(L2_list, r) - 1;
        
        if (first_k > last_k) {
            ans.push(ones_total);
            continue;
        }
        
        let best_gain = 0;
        if (first_k === last_k) {
            const [L1, R1, L2, R2] = pairs[first_k];
            const gain = (R1 - Math.max(L1, l) + 1) + (Math.min(R2, r) - L2 + 1);
            best_gain = Math.max(best_gain, gain);
        } else {
            const [L1, R1, L2, R2] = pairs[first_k];
            const gain1 = (R1 - Math.max(L1, l) + 1) + (Math.min(R2, r) - L2 + 1);
            best_gain = Math.max(best_gain, gain1);
            
            const [L1_l, R1_l, L2_l, R2_l] = pairs[last_k];
            const gain2 = (R1_l - Math.max(L1_l, l) + 1) + (Math.min(R2_l, r) - L2_l + 1);
            best_gain = Math.max(best_gain, gain2);
            
            if (first_k + 1 <= last_k - 1) {
                best_gain = Math.max(best_gain, query_st(first_k + 1, last_k - 1));
            }
        }
        ans.push(ones_total + best_gain);
    }
    return ans;
};