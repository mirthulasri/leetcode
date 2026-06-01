class Solution:
    def combinationSum(self, candidates, target):
        ans = []
        def backtrack(remain, idx, path):
            if remain == 0:
                ans.append(path.copy())
                return
            if idx == len(candidates) or remain < 0:
                return
            # take candidates[idx]
            path.append(candidates[idx])
            backtrack(remain - candidates[idx], idx, path)
            path.pop()
            # skip this candidate
            backtrack(remain, idx + 1, path)

        backtrack(target, 0, [])
        return ans