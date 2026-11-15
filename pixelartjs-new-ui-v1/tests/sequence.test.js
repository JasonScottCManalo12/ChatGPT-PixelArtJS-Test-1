const test = require('node:test');
const assert = require('node:assert/strict');
function nextCombination(values,n){const a=values.slice(),k=a.length;for(let i=k-1;i>=0;i--){if(a[i]<n-k+i){a[i]++;for(let j=i+1;j<k;j++)a[j]=a[j-1]+1;return a;}}return null;}
function sequence(n){const out=[[]];for(let k=1;k<=n;k++){let a=Array.from({length:k},(_,i)=>i);while(a){out.push(a);a=nextCombination(a,n);}}return out;}
test('1-position sequence includes empty and full states',()=>assert.deepEqual(sequence(1),[[],[0]]));
test('3-position sequence is cardinality then lexicographic order',()=>assert.deepEqual(sequence(3),[[],[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]]));
test('5-position sequence covers all 32 unique states',()=>{const s=sequence(5);assert.equal(s.length,32);assert.equal(new Set(s.map(x=>x.join(','))).size,32);assert.deepEqual(s.at(-1),[0,1,2,3,4]);});
test('final combination returns null',()=>assert.equal(nextCombination([2,3],4),null));
